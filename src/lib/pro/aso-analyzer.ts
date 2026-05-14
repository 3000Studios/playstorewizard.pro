/**
 * App Store Optimization (ASO) analyzer (Pro feature).
 *
 * Scores a Play Store listing against ASO best practices:
 *   - Keyword density in the right places (title, short desc, first 167 chars
 *     of full desc — the "above the fold" snippet)
 *   - Title is the strongest signal; short desc is second; full desc is third
 *   - Keyword diversity (don't repeat the same keyword 5 times)
 *   - Readability of the long description
 *
 * No external API. All analysis is text-pattern based and runs in milliseconds.
 */

export interface AsoListing {
  title: string;
  shortDescription: string;
  fullDescription: string;
  /** Optional keywords from the developer's tags. */
  declaredKeywords?: string[];
}

export interface AsoScore {
  /** Overall score 0-100. */
  overall: number;
  /** Per-component scores. */
  components: {
    titleStrength: number;        // 0-100
    shortDescStrength: number;    // 0-100
    fullDescStrength: number;     // 0-100
    keywordDiversity: number;     // 0-100
    readability: number;          // 0-100
  };
  /** Specific issues found, in priority order. */
  issues: AsoIssue[];
  /** Suggested improvements. */
  suggestions: string[];
  /** Detected keywords with usage counts. */
  detectedKeywords: { word: string; count: number; positions: ("title" | "short" | "full")[] }[];
}

export interface AsoIssue {
  severity: "high" | "medium" | "low";
  message: string;
  fix: string;
}

// Common English stopwords. Add per-language sets in future.
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "can", "this", "that", "these", "those",
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
  "my", "your", "his", "its", "our", "their", "to", "of", "in", "on", "for",
  "with", "by", "at", "from", "as", "into", "about", "all", "any", "some",
  "no", "not", "if", "then", "else", "so", "than", "very", "just", "only",
  "more", "most", "such", "now", "up", "down", "out", "off", "over", "under",
  "again", "once", "also", "too", "here", "there", "when", "where", "why", "how",
]);

const SPAM_WORDS = [
  "revolutionary", "ultimate", "game-changing", "innovative", "next-level",
  "best-in-class", "world-class", "cutting-edge", "synergy", "unleash", "unlock",
  "transformative", "paradigm",
];

export function analyzeListing(listing: AsoListing): AsoScore {
  const issues: AsoIssue[] = [];
  const suggestions: string[] = [];

  // ----- Title analysis -----
  const titleStrength = scoreTitle(listing.title, issues);

  // ----- Short description analysis -----
  const shortDescStrength = scoreShortDesc(listing.shortDescription, issues);

  // ----- Full description analysis -----
  const fullDescStrength = scoreFullDesc(listing.fullDescription, issues);

  // ----- Keyword diversity -----
  const titleWords = tokenize(listing.title);
  const shortWords = tokenize(listing.shortDescription);
  const fullWords = tokenize(listing.fullDescription);
  const detectedKeywords = collectKeywords(titleWords, shortWords, fullWords);

  const diversity = scoreKeywordDiversity(detectedKeywords, issues);

  // ----- Readability -----
  const readability = scoreReadability(listing.fullDescription, issues);

  // ----- Generate suggestions from issues -----
  for (const issue of issues) {
    if (issue.fix) suggestions.push(issue.fix);
  }
  if (suggestions.length === 0) {
    suggestions.push("Listing looks solid. Re-run after every meaningful change to the title or descriptions.");
  }

  const overall = Math.round(
    titleStrength * 0.30 +
    shortDescStrength * 0.20 +
    fullDescStrength * 0.20 +
    diversity * 0.15 +
    readability * 0.15
  );

  return {
    overall,
    components: {
      titleStrength,
      shortDescStrength,
      fullDescStrength,
      keywordDiversity: diversity,
      readability,
    },
    issues: issues.sort((a, b) => severityRank(b.severity) - severityRank(a.severity)),
    suggestions: [...new Set(suggestions)],
    detectedKeywords,
  };
}

function severityRank(s: "high" | "medium" | "low"): number {
  return { high: 3, medium: 2, low: 1 }[s];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

// ---------------------------------------------------------------------
//  Per-component scoring
// ---------------------------------------------------------------------
function scoreTitle(title: string, issues: AsoIssue[]): number {
  let score = 100;
  const len = title.length;

  if (len === 0) {
    issues.push({ severity: "high", message: "Title is empty.", fix: "Write a 20-30 character title with your top keyword." });
    return 0;
  }
  if (len > 30) {
    issues.push({
      severity: "high",
      message: `Title is ${len} chars, exceeds Play Store limit of 30.`,
      fix: "Shorten the title and move secondary terms to the short description.",
    });
    return 0;
  }
  if (len < 12) {
    issues.push({
      severity: "medium",
      message: `Title is only ${len} chars. You're leaving search-result real estate on the table.`,
      fix: "Add a keyword or short tagline after your app name. Aim for 20-30 chars.",
    });
    score -= 25;
  }

  const tokens = tokenize(title);
  if (tokens.length < 2) {
    issues.push({
      severity: "medium",
      message: "Title contains no real keywords beyond the app name.",
      fix: "Add 1-2 category keywords. Example: 'Bloom: Habit Tracker'.",
    });
    score -= 20;
  }

  return Math.max(0, score);
}

function scoreShortDesc(short: string, issues: AsoIssue[]): number {
  let score = 100;
  const len = short.length;

  if (len === 0) {
    issues.push({ severity: "high", message: "Short description is empty.", fix: "Write an 60-80 character benefit-led one-liner." });
    return 0;
  }
  if (len > 80) {
    issues.push({
      severity: "high",
      message: `Short description is ${len} chars, exceeds 80.`,
      fix: "Trim to under 80 characters. Lead with the user benefit.",
    });
    return 0;
  }
  if (len < 40) {
    issues.push({
      severity: "low",
      message: `Short description is only ${len} chars. You have room to add a clearer benefit.`,
      fix: "Expand to 60-80 characters with a concrete benefit statement.",
    });
    score -= 10;
  }

  for (const spam of SPAM_WORDS) {
    if (short.toLowerCase().includes(spam)) {
      issues.push({
        severity: "medium",
        message: `Short description contains marketing fluff: "${spam}".`,
        fix: `Replace "${spam}" with a concrete benefit users care about.`,
      });
      score -= 10;
    }
  }

  return Math.max(0, score);
}

function scoreFullDesc(full: string, issues: AsoIssue[]): number {
  let score = 100;
  const len = full.length;

  if (len === 0) {
    issues.push({ severity: "high", message: "Full description is empty.", fix: "Write 800-3000 characters." });
    return 0;
  }
  if (len > 4000) {
    issues.push({
      severity: "high",
      message: `Full description is ${len} chars, exceeds 4000.`,
      fix: "Trim to under 4000 characters.",
    });
    return 0;
  }
  if (len < 500) {
    issues.push({
      severity: "medium",
      message: `Full description is only ${len} chars. Aim for 800-2000.`,
      fix: "Add a features list, social proof, or use cases.",
    });
    score -= 25;
  }
  if (len > 3500) {
    issues.push({
      severity: "low",
      message: `Full description is ${len} chars. Most users will not read past the first 167.`,
      fix: "Move important keywords into the first paragraph.",
    });
    score -= 5;
  }

  // Above-the-fold check
  const fold = full.substring(0, 167);
  if (fold.length === 167 && !/[.!?]/.test(fold)) {
    issues.push({
      severity: "low",
      message: "First 167 chars (the 'above the fold' snippet) doesn't end a sentence.",
      fix: "Restructure the opening so the snippet ends naturally — that's what users see in the truncated preview.",
    });
    score -= 5;
  }

  // Spam fluff check
  let spamHits = 0;
  for (const spam of SPAM_WORDS) {
    const re = new RegExp(`\\b${spam}\\b`, "gi");
    const matches = full.match(re);
    if (matches) spamHits += matches.length;
  }
  if (spamHits > 0) {
    issues.push({
      severity: "medium",
      message: `${spamHits} instance(s) of marketing-fluff words.`,
      fix: "Replace generic praise with concrete user benefits.",
    });
    score -= Math.min(20, spamHits * 5);
  }

  return Math.max(0, score);
}

function collectKeywords(
  titleWords: string[],
  shortWords: string[],
  fullWords: string[]
): { word: string; count: number; positions: ("title" | "short" | "full")[] }[] {
  const map = new Map<string, { count: number; positions: Set<"title" | "short" | "full"> }>();
  for (const w of titleWords) {
    const entry = map.get(w) ?? { count: 0, positions: new Set() };
    entry.count++;
    entry.positions.add("title");
    map.set(w, entry);
  }
  for (const w of shortWords) {
    const entry = map.get(w) ?? { count: 0, positions: new Set() };
    entry.count++;
    entry.positions.add("short");
    map.set(w, entry);
  }
  for (const w of fullWords) {
    const entry = map.get(w) ?? { count: 0, positions: new Set() };
    entry.count++;
    entry.positions.add("full");
    map.set(w, entry);
  }
  return Array.from(map.entries())
    .map(([word, { count, positions }]) => ({ word, count, positions: Array.from(positions) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);
}

function scoreKeywordDiversity(
  keywords: { word: string; count: number }[],
  issues: AsoIssue[]
): number {
  if (keywords.length === 0) return 0;
  let score = 100;
  const stuffed = keywords.filter((k) => k.count > 5);
  if (stuffed.length > 0) {
    issues.push({
      severity: "medium",
      message: `Keyword stuffing detected: "${stuffed[0].word}" appears ${stuffed[0].count} times.`,
      fix: "Reduce repetition. Google penalizes obvious keyword stuffing.",
    });
    score -= 30;
  }
  if (keywords.length < 8) {
    issues.push({
      severity: "low",
      message: `Only ${keywords.length} distinct keywords across the listing.`,
      fix: "Add related terms and synonyms users might search for.",
    });
    score -= 20;
  }
  return Math.max(0, score);
}

function scoreReadability(text: string, issues: AsoIssue[]): number {
  if (text.length === 0) return 0;
  let score = 100;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return 50;
  const avgSentenceLen = text.length / sentences.length;
  if (avgSentenceLen > 200) {
    issues.push({
      severity: "low",
      message: "Sentences average over 200 characters — hard to scan on mobile.",
      fix: "Break long sentences into 2-3 shorter ones.",
    });
    score -= 20;
  }
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  if (text.length > 1500 && paragraphs.length < 3) {
    issues.push({
      severity: "low",
      message: "Long description is one giant paragraph.",
      fix: "Break into 3-5 paragraphs or a bullet list.",
    });
    score -= 15;
  }
  return Math.max(0, score);
}
