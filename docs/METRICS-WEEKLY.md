# Weekly Metrics — playstorewizard.pro

Lightweight, append-only log so future briefings can read prior weeks instead of asking each Monday. **Edit by hand on Sundays.** No automation = no infra cost.

## How to read this file

- One row per cadence week. Week 1 = launch week (2026-05-13 → 2026-05-19).
- Source columns tell future-you (or Claude) where the number came from, so it can be re-verified.
- `TBD` = not yet captured. Fill in on Sunday during the IndieHackers progress post.
- Never delete rows. Strike-through corrections by appending a note in `Notes`.

## Definitions

- **Free signups**: distinct accounts created on the free tier (count distinct email in KV `USER_SITES` or whatever auth store you wire up).
- **Pro upgrades**: paid Pro $9.99/mo subscriptions started in the week (Stripe + PayPal combined, count NEW subs not renewals).
- **MRR**: trailing monthly recurring revenue at end of week (Stripe dashboard → Revenue → MRR; add PayPal monthly subs manually).
- **Top guide views**: URL path of most-viewed guide that week + view count (Cloudflare Workers Analytics → Top requests).
- **Best channel**: which referrer drove the most clicks to playstorewizard.pro (Cloudflare Workers → Web Analytics → Referrers).

## Weekly log

| Week | Dates | Free signups | Pro upgrades | MRR | Top guide views | Best channel | Source / Notes |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-13 → 2026-05-19 | TBD | TBD | TBD | TBD | TBD | Launch week. Cadence Day 1 = Mon 5/18 (rolling); content kit Week 1 covered the closed-testing guide. |
| 2 | 2026-05-20 → 2026-05-26 | | | | | | Cadence: target-API-15 guide on dev.to + Medium. |
| 3 | 2026-05-27 → 2026-06-02 | | | | | | Cadence: Data Safety form walkthrough. |
| 4 | 2026-06-03 → 2026-06-09 | | | | | | End-of-month review: drop bottom 2 channels. |

## End-of-week ritual (5 min, Sunday 10:00 UTC)

1. Open Stripe dashboard → copy this week's MRR + new Pro count.
2. Open Cloudflare Workers Analytics → copy top guide URL + view count.
3. Open Cloudflare Web Analytics → copy top referrer.
4. Paste into the row for the current week.
5. Commit: `git add docs/METRICS-WEEKLY.md && git commit -m "metrics: week N" && git push`
6. Post the Day 7 X update from the current week's content kit using these numbers.

## Triggers to act

- Free signups < 5/week for 2 weeks → distribution is broken, not the funnel. Pause feature work; double down on the channel that converted best.
- Pro upgrades = 0 for 3 weeks → free → Pro conversion path is broken (or pricing is wrong for the audience you're reaching). Fix the upgrade prompt before more content.
- MRR not growing week-over-week by week 6 → reconsider the project per CLAUDE.md "Simplify and Ship" rules.

## Historical note

This file was created 2026-05-17 as part of the scheduled weekly briefing. Week 1 numbers retro-fill once they're available.
