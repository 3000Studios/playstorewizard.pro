# Content + Community Kit — Week 1

**Goal:** Stand up a weekly content rhythm with zero ad spend. Built around your existing 15 long-form guides and the verified pain points from the audit.

**How to use this file:** copy-paste each section directly into the target channel. Do not over-edit — the wording is tuned for indie-dev voice. Replace `{NUMBER}` and `{LINK}` placeholders before posting.

---

## 1. IndieHackers Launch Post (post once, then engage replies for 3–5 days)

**Suggested title:**
> I built a Google Play compliance tool — here are the 22 rules Google rejects apps on

**Body (post to https://www.indiehackers.com/group/launched):**

> Quick context: Google blocked **1.75 million apps from publishing in 2025** alone — most for the same handful of policy violations (crashes, thin content, excessive permissions, broken privacy links, failed closed testing). I spent the last six months building **Playstore Wizard** — a guided 12-step publishing studio that catches those rejections before you ever hit "submit."
>
> What it does:
>
> - **22-rule compliance checker** that runs against current Play Store policies (updated monthly).
> - **Free AI generators** for description, privacy policy, and review replies — powered by Cloudflare Workers AI, so I don't pay per token and neither do you.
> - **Browser-side AAB/APK parser** — your bundle never leaves your device. Pure TypeScript with fflate.
> - **One-click submit** to Play Developer API (optional, paid tier).
> - **15 long-form guides** on the rules that actually trip devs up (closed testing 12-testers-14-days, Data Safety form, target API 15, account-deletion rule, etc.).
>
> **Pricing:** Free tier is a real product (single app, full compliance check, English AI description). Pro is $9.99/mo for unlimited apps + multi-language AI + scheduled releases. There's a $199 lifetime if monthly subscriptions aren't your thing.
>
> **Tech & cost:** Next.js 15 on Cloudflare Workers, Workers AI for inference, KV for state. $0/mo running cost in the default config. CI runs typecheck + lint + build on every push. The compliance rules and the AAB parser are open-source under MIT.
>
> **What I'm asking for:** if you've ever shipped to Play and gotten rejected for something dumb, I'd love to hear which rule bit you. I'm building the compliance ruleset in public — every rule we encode is one fewer dev who loses a weekend.
>
> Free tier: https://playstorewizard.pro
> The closed-testing guide (most-hated rule): https://playstorewizard.pro/guides/closed-testing-12-testers-14-days
>
> Happy to answer questions about the stack, the pricing, the AI cost math, or anything else. Solo founder, Florida.
>
> — J. Swain / 3000 Studios

**Engagement tips for replies:**
- Always answer with a specific number or fact, not generic enthusiasm.
- If someone shares a rejection story, ask which rule (turns the comment into a free product-research note).
- Pin one reply with a list of all 15 guides — encourages click-through.

---

## 2. Seven Build-in-Public X / Twitter Posts (one per day, Week 1)

Post at **14:00–17:00 UTC** Tue–Thu for max engagement; weekends earlier (10:00 UTC). Use `#androiddev #indiehackers #buildinpublic`. Pin Day 1.

### Day 1 — Monday (hook + ask)

> Google blocked 1.75M apps from publishing in 2025. Most got hit for the same 5 reasons.
>
> Spent 6 months building a tool that catches those before you hit submit.
>
> Free tier live: playstorewizard.pro
>
> AMA on the 22 rules I had to encode 👇

### Day 2 — Tuesday (the list — gives value, not pitch)

> Top 5 reasons Google rejected apps in 2025, by frequency:
>
> 1. Crashes during review
> 2. Thin content / weak listing
> 3. Excessive permissions
> 4. Broken or missing privacy policy
> 5. Failed closed testing (12 testers / 14 days)
>
> My compliance checker covers all 22 known rules. Free tier covers 1 app: playstorewizard.pro

### Day 3 — Wednesday (technical screenshot)

> Built a Google Play AAB parser that runs entirely in your browser.
>
> Your app bundle never leaves your device. Pure TypeScript, ~600 lines, uses fflate for ZIP + protobuf parsing.
>
> Privacy-first compliance tooling shouldn't require uploading the very thing you're trying to protect.
>
> [attach: screenshot of parser output in the wizard]

### Day 4 — Thursday (pricing context)

> Mobile app intelligence tool pricing in 2026:
>
> - Sensor Tower: $79–$399/mo
> - AppFollow: $179/mo
> - AppTweak: €69/mo
> - App Radar: $59/mo
> - Komori: $19.99/mo
> - Playstore Wizard: $9.99/mo
>
> Different scope — I do publishing + compliance, not ASO. But indie devs aren't paying $79/mo for a side project.

### Day 5 — Friday (the closed-testing rant)

> The most-hated Google Play rule: if you opened your personal Play dev account after Nov 13, 2023, you must run a closed test with 12 testers continuously opted in for 14 days before you can even APPLY for production access.
>
> Wrote a guide on satisfying it without losing weeks: playstorewizard.pro/guides/closed-testing-12-testers-14-days

### Day 6 — Saturday (story / vulnerability)

> Almost killed this project 3 times. Every Play policy update forced me to refactor the compliance engine.
>
> Then I realized: that pain IS the product. Policy churn is exactly why indie devs need a tool that absorbs it for them.
>
> Now the rule engine is in TypeScript and a policy update is a 10-min PR.

### Day 7 — Sunday (specific weekly update — fill in real numbers)

> Week 1 since going public:
>
> 🆕 Free signups: {NUMBER}
> 💳 Pro upgrades: {NUMBER}
> 💰 MRR: ${NUMBER}
> ⏱️ Built solo, no ad spend, $0/mo running cost (Cloudflare Workers free tier)
>
> Reply if you ship to Play — what's your worst rejection story?

---

## 3. dev.to / Medium Repost — `closed-testing-12-testers-14-days` Guide

The guide on `playstorewizard.pro/guides/closed-testing-12-testers-14-days` is your highest-pain SEO target. Repost it on dev.to and Medium with the personal intro below (a different lead-in avoids duplicate-content penalties; Google reads them as distinct articles linking to the original).

### Suggested dev.to title

> The 12-Tester 14-Day Rule Is Why Indie Android Devs Want to Quit. Here's How to Survive It.

### Personal intro to paste above the guide content (150 words)

> I shipped my first Android app on a personal Play developer account in late 2024. It took me one weekend to build, three weeks to publish — and almost all of that delay came from one rule: the closed-testing requirement that Google introduced for personal accounts in November 2023.
>
> Twelve testers. Continuously opted in. Fourteen consecutive days. Then a manual production-access review with no SLA.
>
> Every indie dev I've spoken to since has hit the same wall. Most of them assumed it was a glitch and lost a week trying to publish before realizing the rule is permanent. So I'm writing this down once, in plain English, with the specific recruitment tactics that actually worked for me and the ones that did not. If you're staring at the Play Console wondering why "Apply for production" is greyed out, this is for you.

(Then paste the full guide body below this intro.)

**Footer to add at the bottom of the repost:**

> Originally published at [playstorewizard.pro/guides/closed-testing-12-testers-14-days](https://playstorewizard.pro/guides/closed-testing-12-testers-14-days). I'm building a Play Store compliance tool that catches the other 21 rules too — free tier at [playstorewizard.pro](https://playstorewizard.pro).

### Medium notes

- Use the same intro and footer.
- Submit to relevant publications: *The Startup*, *Better Programming*, *Towards Dev*.
- Use the canonical URL feature pointing back to the playstorewizard.pro original so search engines treat it as the source.

---

## 4. Reddit r/androiddev — How to Behave

**Do not pitch.** Period. Mods will remove and shadowban.

Instead:

- Answer 1 question per day. Set a 30-minute morning timer.
- When the question maps to a guide you've written, link the guide as ONE option among others. Example: "I solved this with the 12-tester rule guide here — [link]. Also worth checking the Play Console release tracks doc."
- Once you have 20+ helpful answers logged, post a single Show-and-Tell thread (subreddit rules permitting) titled e.g. *"I encoded the Play Store's 22 most-cited rejection rules — here's what I learned."*

**Subreddits worth a slot in rotation:**
- r/androiddev (primary)
- r/AndroidDev (alt)
- r/indiehackers (broader audience)
- r/SaaS (lifetime-license buyer audience)
- r/sideproject (launch announcements only)

---

## 5. 30-Day Rolling Calendar

| Day | Channel | Action | Time cost |
|---|---|---|---|
| Mon | r/androiddev | Answer 1 question. Link a guide only if directly relevant. | 30 min |
| Tue | X | Post one of the 7 build-in-public tweets (Day 1 is launch). | 5 min |
| Wed | X | Technical post (screenshot, code snippet, or stat). | 10 min |
| Thu | dev.to OR Medium | Repost one guide with fresh intro. Rotate guides weekly. | 1 hr |
| Fri | X | Story / vulnerability / behind-the-scenes. | 10 min |
| Sat | X | Recap or fun fact. | 5 min |
| Sun | IndieHackers | Weekly progress post (signups, MRR, lessons). | 30 min |

**Weekly time budget: ~3 hours.** Less than a single client call.

**At end of week 4, review:**
- Which channel sent the most paying users?
- Which guide reposts got the most engagement?
- Which X post got the most replies?
- **Double down on the top 2 channels. Drop the bottom 2.** Do not try to maintain 7 channels in parallel.

---

## 6. Guide Repost Rotation (Weeks 1–15)

Pick one guide per week to repost on dev.to + Medium. Sequence below is ordered by audience pain volume.

1. Closed testing 12 testers 14 days
2. Target API level Android 15
3. Data Safety form walkthrough
4. Privacy policy requirements
5. Account deletion rule
6. Permissions justification
7. AAB vs APK explained
8. Google Play Console setup
9. Play billing fees 2026
10. Alternative billing explained
11. Content rating IARC guide
12. Screenshot sizes guide
13. Feature graphic design
14. Store listing best practices
15. Families policy children apps

After week 15, start over and refresh each post with new numbers.

---

## 7. Pre-flight Checklist Before You Go Live

Before posting Day 1 on Monday:

- [ ] `.gitattributes` committed to repo (already created by Claude; commit + push)
- [ ] Stripe + PayPal $1 production test passed (see CHECKOUT-VERIFICATION.md)
- [ ] AdSense application status confirmed in dashboard
- [ ] Free-tier signup flow works end-to-end on a private window
- [ ] All 15 guide URLs return 200 (use a quick `curl -I` loop)
- [ ] Twitter/X account created and bio set: "Building playstorewizard.pro · indie Play Store publishing studio · free tier live"
- [ ] IndieHackers account confirmed, profile filled
- [ ] dev.to account confirmed, profile filled with canonical-URL knowledge

If anything in this list is "no," fix it before Day 1 — distribution amplifies whatever's there, broken or working.
