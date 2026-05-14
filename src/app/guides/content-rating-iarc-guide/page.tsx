import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "content-rating-iarc-guide";
const guide = getGuide(SLUG);

export const metadata = pageMetadata({
  title: guide?.title ?? "",
  description: guide?.summary ?? "",
  path: `/guides/${SLUG}`,
});

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>The IARC content-rating questionnaire is mandatory for every Play Store app. Skip it and your submission stays in &quot;Setup&quot; status forever. Answer it carelessly and you get a rating that either over-restricts your audience (lost installs) or under-rates your content (policy strike, possible removal). Here&apos;s how to navigate every question.</p>

      <h2>What IARC is and what it produces</h2>
      <p>IARC stands for International Age Rating Coalition. It&apos;s a consortium of regional rating bodies — ESRB (US/Canada), PEGI (Europe), USK (Germany), ClassInd (Brazil), and others — that share a single questionnaire and produce region-specific ratings from one set of answers.</p>
      <p>When you complete the questionnaire in Play Console, IARC issues you a certificate within minutes. The certificate gives your app distinct ratings for each region: an ESRB rating for North America, a PEGI rating for most of Europe, a USK rating for Germany, etc. Your Play Store listing displays the relevant rating to each user based on their region.</p>

      <h2>Why &quot;just pick Everyone&quot; is dangerous</h2>
      <p>It&apos;s tempting to answer every question &quot;no&quot; and walk away with an Everyone rating. But if your app contains anything that contradicts that answer — user-generated content, location sharing, in-app purchases, ads — Google&apos;s automated scanners or human reviewers eventually catch the mismatch. The result is a policy strike and a forced re-rating with whatever audience restrictions apply. Always answer accurately the first time.</p>

      <h2>Section-by-section breakdown</h2>
      <h3>Violence</h3>
      <p>The threshold for &quot;violent content&quot; is lower than developers expect. Cartoon physics (e.g. a Mario-style stomp on an enemy) typically doesn&apos;t count, but anything more graphic does. If your game has health bars, weapons, or enemies that visibly take damage, treat the violence questions carefully.</p>
      <p>Realistic depictions of blood, gore, dismemberment, or violence toward humanoid characters push you toward Mature 17+. Stylized fantasy violence (sword combat without blood) typically lands at Teen.</p>

      <h3>Sexual content</h3>
      <p>Suggestive imagery, romantic content with implied sexual undertones, and references to sexual acts all count. Even &quot;tasteful&quot; depictions of nudity (art apps, anatomy reference) bump you toward Teen or Mature. Apps with explicit content cannot be on Play Store at all — they violate separate Adult Content policies regardless of rating.</p>

      <h3>Profanity and crude humor</h3>
      <p>Mild language (&quot;damn&quot;, &quot;hell&quot;) is generally OK at Everyone. Stronger profanity (the F-word and similar) bumps you to Teen or Mature depending on frequency. User-generated content that could contain profanity counts — if your app has chat, comments, or shared text, assume profanity is possible and answer accordingly.</p>

      <h3>Drugs, alcohol, tobacco</h3>
      <p>Realistic depictions and explicit references are the trigger. A game where characters drink at a tavern (without further detail) is usually fine; a game with detailed drug-dealing mechanics is not. Educational apps about substance abuse usually answer yes here and the rating tools account for the educational context.</p>

      <h3>Gambling</h3>
      <p>This is the biggest trap for indie developers. Many apps with loot boxes, gacha mechanics, or any in-game economy with random rewards risk being classified as gambling — especially in regions like Belgium, the Netherlands, and Germany where gambling regulators have taken aggressive stances. Even if you don&apos;t consider it gambling, if real money buys randomized outcomes, declare it.</p>

      <h3>User-generated content</h3>
      <p>Any feature that lets users create or share content (chat, comments, custom levels, profile bios) is UGC. Declaring UGC pushes your rating to at least Teen in most regions and triggers additional policies (content-moderation requirements, COPPA considerations if you have child users).</p>

      <h3>Location sharing</h3>
      <p>If your app shares user location with other users (friends, matchmaking, social features), declare it. Apps that use location only for the user&apos;s own benefit (weather, navigation) without sharing don&apos;t need to declare it here.</p>

      <h3>Personal information sharing</h3>
      <p>If users can share profile information with each other (social apps, marketplaces, dating), declare it. Apps where personal info stays between user and developer don&apos;t.</p>

      <h2>What to do if your rating seems too high</h2>
      <p>Sometimes the questionnaire produces a rating that feels harsher than your app warrants. The first step is to review your answers and confirm you didn&apos;t over-declare. If you&apos;re confident the answers are right but the rating is wrong, you can contest it with IARC directly through the appeal link in the certificate. Appeals work occasionally but are slow.</p>
      <p>The faster fix is usually to change the app to match the rating you want. Removing a feature, tightening UGC moderation, or removing a borderline-violent visual asset is often the right call commercially.</p>

      <h2>Re-rating after app changes</h2>
      <p>If your app changes substantially — new features that affect the answers, removed features that no longer apply — re-take the questionnaire. Doing this proactively avoids policy strikes when reviewers notice the mismatch later.</p>
    </GuideLayout>
  );
}
