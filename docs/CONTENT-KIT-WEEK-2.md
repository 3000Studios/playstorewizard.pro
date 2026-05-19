# Content + Community Kit — Week 2 (2026-05-18 → 2026-05-24)

**Rotation guide:** Target API level Android 15 — `playstorewizard.pro/guides/target-api-level-android-15`
**Calendar week:** 20 → 21 of 2026
**Days since launch:** 5–11

How to use: copy-paste each section into the target channel. Replace `{NUMBER}` and `{LINK}` placeholders before posting. Time budget: ~3 hrs across the week.

---

## 1. Day-by-day post schedule

| Day | Date | Channel | Action | Time |
|---|---|---|---|---|
| Mon | 5/18 | r/androiddev | Answer 1 question — only link guide if directly relevant | 30 min |
| Tue | 5/19 | X | Build-in-public post (see §2 Day 2) | 5 min |
| Wed | 5/20 | X | Technical screenshot post (see §2 Day 3) | 10 min |
| Thu | 5/21 | dev.to + Medium | Repost target-API-15 guide with fresh intro + canonical (see §3) | 1 hr |
| Fri | 5/22 | X | Story post (see §2 Day 5) | 10 min |
| Sat | 5/23 | X | Recap post (see §2 Day 6) | 5 min |
| Sun | 5/24 | IndieHackers + X | Week 2 progress post (see §2 Day 7) | 30 min |

Post times: Tue–Thu 14:00–17:00 UTC, weekends 10:00 UTC. Hashtags: `#androiddev #indiehackers #buildinpublic`.

---

## 2. Seven build-in-public X posts (Week 2)

### Day 1 — Monday 5/18 (no X post — r/androiddev day)

Spend the 30 minutes on reddit instead. New X content resumes Tuesday.

### Day 2 — Tuesday 5/19 (build-in-public weekly cadence)

> Week 2 of building Playstore Wizard in public.
>
> What shipped last week:
> • Workers AI inference enabled (free tier description generation, $0/call)
> • Site generator + subdomain publishing (Pro feature)
> • Pro tier dropped to $9.99/mo
> • AdSense pub ID activated
>
> What I'm doing this week: target-API-15 guide repost on dev.to.
>
> Free tier: playstorewizard.pro

### Day 3 — Wednesday 5/20 (technical / screenshot)

> Aug 31, 2025 is the day Google's target API level requirement bit thousands of indie devs.
>
> If your app targets anything below API 35 (Android 15), Play hides it from updates and new installs in supported countries.
>
> The wizard flags this in 2 seconds from a local AAB scan. No upload.
>
> [attach: screenshot of compliance checker output flagging targetSdk < 35]

### Day 4 — Thursday 5/21 (push the repost)

> Just reposted my target-API-15 guide on dev.to with the recruitment tactics I used to satisfy the rule without losing a week.
>
> Original: playstorewizard.pro/guides/target-api-level-android-15
> dev.to: {LINK_TO_DEVTO_REPOST}
>
> Save the dev.to link for the next time Play tells you "your app must target Android 15+."

### Day 5 — Friday 5/22 (story / vulnerability)

> Honest moment: I encoded the target-API-15 rule first because it cost a client of mine a launch deadline in Aug 2025.
>
> They thought "we'll bump targetSdk later." Later turned into 6 weeks of being unable to ship updates.
>
> Every rule in my compliance engine has a story like that. Pain → product.

### Day 6 — Saturday 5/23 (recap fact)

> Quick recap, 2 weeks public:
>
> ✅ 22 Play Store rules encoded
> ✅ 15 long-form guides live
> ✅ Browser-side AAB parser (your bundle never leaves your device)
> ✅ $0/mo running cost (Cloudflare Workers free tier)
> ✅ Free tier is a real product, not a demo
>
> playstorewizard.pro

### Day 7 — Sunday 5/24 (specific weekly update — FILL IN NUMBERS)

Copy this, fill in 4 numbers, post 10:00 UTC Sunday:

> Week 2 since going public:
>
> 🆕 Free signups: {NUMBER} (week 1: {LAST_WEEK_SIGNUPS})
> 💳 Pro upgrades: {NUMBER} (week 1: {LAST_WEEK_PRO})
> 💰 MRR: ${NUMBER} (week 1: ${LAST_WEEK_MRR})
> 🚢 Shipped: target-API-15 guide on dev.to, {OTHER_SHIPPED}
>
> The 22-rule compliance engine catches what Play rejects on. Free tier, single app: playstorewizard.pro
>
> Reply if you've shipped to Play — which rule cost you the most time?

---

## 3. dev.to / Medium repost — `target-api-level-android-15`

### Suggested dev.to title

> Google's August 2025 Target API 15 Deadline Killed Thousands of Indie Apps. Here's the One-Day Fix.

### Personal intro to paste above the guide content (~150 words)

> If your Android app's `targetSdkVersion` is anything below 35, Google has been quietly hiding it from new installs and updates in dozens of countries since August 31, 2025. Existing users keep their copies — but you cannot ship updates, and new users on supported devices cannot find or install you. The clock started ticking the day Android 15 went GA.
>
> I encoded this rule into my compliance checker first because it cost a client a launch deadline. They had built a fine app, run a closed test, prepped the store listing — and discovered on submit day that their `targetSdk = 33` quietly blocked the entire production track. Six weeks of churn followed.
>
> This guide is the one-day version: what the rule actually says, which apps it applies to, the exact `build.gradle` changes, and the runtime API gotchas that catch teams off-guard when they bump from 33/34 to 35.

(Then paste the full guide body below this intro.)

### Footer for the repost

> Originally published at [playstorewizard.pro/guides/target-api-level-android-15](https://playstorewizard.pro/guides/target-api-level-android-15). I'm building a Play Store compliance tool that catches the other 21 rules too — free tier at [playstorewizard.pro](https://playstorewizard.pro).

### dev.to canonical setup

In the dev.to post editor's "Canonical URL" field, paste:
`https://playstorewizard.pro/guides/target-api-level-android-15`

This tells Google the playstorewizard.pro version is the source — your SEO juice stays on your domain, not dev.to's.

### Medium notes

- Use the same intro + footer.
- Submit to publications: *The Startup*, *Better Programming*, *Towards Dev*.
- Set canonical URL the same way.

---

## 4. r/androiddev Monday script (5/18)

Open r/androiddev sorted by "new". 30-min timer. Find ONE question that maps to:
- target API 15 / `targetSdkVersion`
- App bundle parsing / AAB internals
- Play Console release tracks
- Closed testing setup
- Data Safety form

Reply with substance. **Do not pitch.** Mention the wizard only if a guide on your site is the most direct answer — and only as ONE option among others.

Bad: "Try playstorewizard.pro!"
Good: "I wrote up the exact `build.gradle` change here: [link]. Also worth checking Google's own targetSdk migration doc, which has the runtime API change list."

Goal this week: log 1 helpful reply. By Week 4 you should have 20+ helpful answers banked before doing a Show-and-Tell post.

---

## 5. Pre-flight checklist before Monday morning

Run this Sunday evening 5/17 or Monday 5/18 before posting:

- [ ] dev.to account confirmed, profile has playstorewizard.pro link
- [ ] Medium account confirmed
- [ ] X account bio updated with "Week 2 of building in public"
- [ ] IndieHackers profile filled
- [ ] target-API-15 guide URL returns 200: `curl -I https://playstorewizard.pro/guides/target-api-level-android-15`
- [ ] AdSense status check in dashboard (don't drive traffic if ads are blank-pending)
- [ ] Cloudflare Workers analytics tab open — note current `/guides/closed-testing-12-testers-14-days` view count as baseline for the "did Week 1 convert?" question

---

## 6. Push question for the week

**Did Week 1's closed-testing repost actually move traffic?**

Check Cloudflare Workers analytics tab for `/guides/closed-testing-12-testers-14-days` views vs. the other 14 guides. If it dominated → rotation order is right, keep pushing highest-pain guides first. If it flatlined → distribution is the bottleneck, not the guide. Knowing which means knowing what to fix in Week 3.

If you can't answer this by Tuesday, the metric isn't being captured. Fix the measurement before fixing the channel.

---

## 7. Rotation reminder — what's next

- Week 2 (this week): Target API level Android 15
- Week 3 (5/25–5/31): Data Safety form walkthrough
- Week 4 (6/1–6/7): Privacy policy requirements

At end of Week 4: review which channel sent the most paying users. Drop the bottom 2 channels. Do not try to maintain 7 channels in parallel.
