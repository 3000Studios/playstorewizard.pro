import type { BlogPost } from "./types";

/**
 * Bundled seed posts. They guarantee the blog is never empty (good for SEO and
 * AdSense review) and act as the editorial baseline. Generated posts are layered
 * on top from KV at runtime.
 */
export const SEED_POSTS: BlogPost[] = [
  {
    slug: "google-play-2026-policy-roundup",
    title: "Google Play in 2026: The Policy Changes That Actually Affect Your Launch",
    excerpt:
      "Target API 35, the 12-tester rule, tightened data-safety enforcement, and account deletion — the changes most likely to get a 2026 submission rejected, and how to stay clear.",
    category: "Policy Updates",
    tags: ["google play", "policy", "2026", "compliance"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 6,
    publishedAt: "2026-05-20",
    updatedAt: "2026-05-20",
    source: "seed",
    body: `Google ships dozens of policy updates a year, but only a handful change what you must do before you can hit "submit." Here are the ones that matter most for a 2026 launch.

## Target API level 35 is now mandatory

Every new app and every update must target Android 15 (API level 35). Submissions below that threshold are rejected at upload. If your Gradle config still points at an older compile or target SDK, fix it before anything else — no listing work matters until the bundle is accepted.

## The 12-tester, 14-day rule still bites new accounts

Personal developer accounts created after November 2023 must run a closed test with at least 12 testers for 14 continuous days before requesting production access. Plan for this early; it is the single biggest cause of "why can't I publish?" support tickets.

## Data safety enforcement got stricter

Google now cross-checks your declared data collection against the SDKs detected in your bundle. A mismatch — declaring "no data collected" while bundling an analytics SDK — is a fast rejection. Declare every SDK that touches user data, including crash reporters.

## Account deletion is non-negotiable for accounts apps

If your app lets users create an account, you must provide an in-app and web path to request account and data deletion. Missing this is a common last-minute blocker.

## How to stay clear

Run a full compliance pass before you build your store listing. Fixing a bundle-level issue after you've written descriptions and uploaded screenshots wastes the most time. Playstore Wizard checks all of the above automatically before you submit.`,
  },
  {
    slug: "store-listing-conversion-checklist",
    title: "The Store Listing Conversion Checklist: Turning Impressions Into Installs",
    excerpt:
      "Your install rate is decided in the first three seconds. A field-by-field checklist for the icon, first two screenshots, and short description that move the needle.",
    category: "Listing & ASO",
    tags: ["aso", "store listing", "conversion", "screenshots"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 5,
    publishedAt: "2026-05-22",
    updatedAt: "2026-05-22",
    source: "seed",
    body: `Most developers obsess over keywords and ignore the assets that actually convert a browser into an installer. Ranking gets you the impression; the listing earns the install.

## The icon does more work than the title

On a crowded results page, the icon is the first and often only thing a user evaluates. Keep it simple, high-contrast, and legible at 48px. Avoid text inside the icon — it turns to mush at small sizes.

## The first two screenshots decide everything

Google shows the first two or three screenshots inline. Treat them as a billboard, not a gallery. Lead with your single strongest benefit, captioned in plain language. Save the feature tour for screenshots four through eight.

## Write the short description for a skimmer

The 80-character short description appears above the fold. State what the app does and who it's for — not a slogan. "Track workouts and see your progress" beats "Your fitness journey starts here."

## Localize the assets, not just the text

A translated description with English screenshots converts poorly. If a market matters, localize the captions inside the screenshots too.

## Measure, then iterate

Use Play Console's store listing experiments to A/B test the icon and first screenshot. Conversion lifts of 15–30% from a single asset swap are common.`,
  },
  {
    slug: "play-billing-fees-what-you-keep",
    title: "Play Billing Fees in 2026: What You Actually Keep",
    excerpt:
      "Service fee tiers, the 15% small-business rate, alternative billing, and the math that decides whether a subscription or one-time purchase nets you more.",
    category: "Monetization",
    tags: ["play billing", "fees", "monetization", "subscriptions"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 5,
    publishedAt: "2026-05-25",
    updatedAt: "2026-05-25",
    source: "seed",
    body: `Before you price anything, you need to know what Google keeps. The headline "30%" is rarely the number that applies to you.

## The 15% small-business rate

Through the Play Console small-business program, your first $1M in annual revenue is charged a 15% service fee, not 30%. Most independent developers never cross that threshold, so 15% is the rate to plan around.

## Subscriptions are 15% after the program

Auto-renewing subscriptions are charged 15% once enrolled in the relevant programs, making recurring revenue meaningfully cheaper to operate than one-time purchases at the standard rate.

## Alternative billing changes the math

In eligible regions, offering an alternative billing system reduces Google's fee by a few points — but you take on payment processing, fraud, and support costs. For most small developers the net is a wash; only scale makes it worth the operational burden.

## Run the real net calculation

Decide pricing on net revenue per user, not list price. A $4.99 subscription at 15% nets more over a year than a $9.99 one-time purchase at 30% for any user who stays more than four months. Playstore Wizard's pricing recommender runs this comparison for your category automatically.`,
  },
  {
    slug: "closed-testing-12-testers-14-days-guide",
    title: "Closed Testing on Google Play: Finding 12 Testers and Surviving the 14 Days",
    excerpt:
      "New personal developer accounts must run a closed test with at least 12 testers for 14 continuous days before production. Where to find real testers, how to keep them opted in, and the mistakes that reset the clock.",
    category: "Submission",
    tags: ["closed testing", "12 testers", "production access", "launch"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 7,
    publishedAt: "2026-10-16",
    updatedAt: "2026-10-16",
    source: "seed",
    body: `If you created your Google Play developer account as an individual after November 2023, you already know the rule that stops more launches than any policy rejection: before you can apply for production access, you must run a closed test with at least 12 testers who stay opted in for 14 continuous days. Not 12 installs. Not 12 downloads in a week. Twelve testers, opted in, fourteen days, no gaps.

## What Google actually counts

The metric is testers who have opted in to your closed test track and remain opted in. A tester who installs on day one and opts out on day nine does not give you nine days of credit toward a clean run — Google evaluates whether at least 12 testers were continuously opted in across the 14-day window. Dropping below 12 mid-run is the most common way developers lose a week without realizing it until they apply for production and get told to test more.

## Where to find 12 real testers

- Your own devices and household: legitimate, limited, and rarely enough on their own.
- Friends, family, and colleagues: ask for the full 14 days explicitly, and send the opt-in link (not the app link) — testers must join through the testing program.
- Developer communities: testing-exchange groups and subreddits where indie developers test each other's apps. This works when you reciprocate genuinely — install, use, and stay opted in on theirs.
- Your existing audience: a mailing list, a Discord, or social followers. Even a small audience usually contains 12 people willing to help a launch.

One warning: paid "tester farms" that cycle accounts through opt-ins are a policy risk. Accounts that opt in and never engage, or that churn across hundreds of tests, can undermine the credibility of your test and your account. Real testers who actually open the app are both safer and more useful.

## Keeping testers opted in for 14 days

Most attrition is not malice; it is confusion. Send the opt-in link with three lines of instruction: tap the link, choose "Become a tester," then install from the Play Store listing that appears. Day-3 and day-10 check-in messages ("still opted in? reply with a screenshot of your home screen icon") catch silent opt-outs while there is still time to recruit a replacement. Ship one small update mid-test: it gives testers a reason to reopen the app and gives you real crash data before production.

## Use the 14 days like you mean it

Google's production-access application asks what you learned from testing. Teams that treated the closed test as a waiting room write vague answers; teams that ran a real test can cite specifics — the onboarding step testers abandoned, the crash on one device family, the feedback that changed the first-run flow. Collect feedback deliberately: a one-page form, a feedback group, or Play's own feedback channel. Fix what you find, and keep notes. Those notes are your application.

## The mistakes that reset your progress

- Recruiting exactly 12: one opt-out puts you under the line. Recruit 16–20 so normal attrition cannot hurt you.
- Starting the clock before the build is stable: a crashing first build burns goodwill you cannot re-recruit.
- Confusing tracks: testers must be on the closed track you will cite in the application, opted in through that track's link.
- Going silent: testers who hear nothing assume the project died and clean up their test list.

Fourteen days feels long only when nothing is happening. Run it as your soft launch — real users, real feedback, real fixes — and it becomes the cheapest QA program Google ever made you buy.`,
  },
  {
    slug: "google-play-rejection-appeals-guide",
    title: "Rejected by Google Play? How Appeals, Violations, and Resubmission Actually Work",
    excerpt:
      "A rejection email is not the end of your launch. The difference between a violation and a rejection, what an appeal can and cannot do, and how to resubmit without stacking up strikes.",
    category: "Compliance",
    tags: ["rejection", "appeal", "policy", "resubmission"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 7,
    publishedAt: "2026-10-16",
    updatedAt: "2026-10-16",
    source: "seed",
    body: `Every developer gets the email eventually. Your app update was rejected, or your submission was found in violation of a policy with a name that sounds broader than what your app actually does. The panic response — resubmitting immediately with random changes — is also the worst one. Here is how the system actually works, and how to get through it with your account in good standing.

## Rejection vs. violation: different problems, different fixes

A rejection means this specific submission does not comply; your app (if already live) keeps serving its previous version, and you fix the issue and resubmit. A policy violation recorded against your app is more serious: it can come with a deadline to comply, removal of the app, or — for egregious or repeat issues — account-level consequences. Read the email for three things: the exact policy cited, the exact asset or behavior flagged (a screenshot, a metadata field, a permission), and the enforcement scope. Google almost always tells you precisely which of these it is; developers get in trouble by fixing the thing they assumed instead of the thing cited.

## The most common rejection causes

- Metadata violations: claims in your title, short description, or screenshots that the app does not substantiate — superlatives, competitor trademarks, or feature promises the build does not keep.
- Data safety mismatches: declared data practices that do not match the SDKs and permissions in the bundle.
- Permission justification: sensitive permissions (background location, exact alarms, photo access beyond your core feature) without a clear, demonstrable reason.
- Privacy policy problems: a missing policy, a policy URL that does not load, or a policy that does not name the data your app collects.
- Deceptive behavior flags on ordinary design: buttons that mimic system dialogs, ads that imitate content, or flows that pressure users.

Notice the pattern: most rejections are about the listing and declarations, not the app's code. That is good news — those are the fastest fixes in the entire launch process.

## How to appeal (and when not to)

Appeal when the decision is factually wrong: the flagged asset is not in your submission, the policy does not apply to your app's category, or you can document compliance the reviewer missed. A good appeal is short and evidentiary: name the policy, state the fact, attach the proof (a screenshot of the actual flow, the relevant code behavior, the corrected declaration). Appeals are reviewed by humans; make the human's job easy.

Do not appeal when the fix is obvious and within your control. Fixing and resubmitting is faster, and appeals spent on clear violations cost you credibility you may need later. And never resubmit the identical build hoping for a different reviewer — repeated non-compliant submissions are exactly what turns a rejection into an account problem.

## Resubmit like a professional

Change the thing that was cited, then audit its neighbors: if one screenshot made an unsubstantiated claim, check every screenshot and both descriptions. Note the change in your resubmission where the console allows notes. Then stop touching unrelated parts of the listing — a resubmission that changes twelve things gives the reviewer twelve new things to question.

Keep a simple log per submission: date, version, what changed, the outcome. Developers who keep this log stop repeating their own rejections; developers who do not, meet the same email twice. Playstore Wizard's compliance check exists to run this audit before Google does — declarations against bundle, listing claims against features, policy against data practices — because the cheapest rejection is the one that never gets submitted.`,
  },
  {
    slug: "play-app-signing-upload-key-guide",
    title: "Play App Signing Explained: Upload Keys, App Signing Keys, and Not Locking Yourself Out",
    excerpt:
      "Two keys guard every Android app: the app signing key Google holds, and the upload key you hold. Which one actually matters, what happens when you lose each, and the one backup habit that prevents disaster.",
    category: "Submission",
    tags: ["app signing", "upload key", "keystore", "security"],
    author: "Playstore Wizard Editorial",
    readingTimeMin: 6,
    publishedAt: "2026-10-16",
    updatedAt: "2026-10-16",
    source: "seed",
    body: `Ask a room of Android developers what keeps them up at night and keystores come up fast. Play App Signing — mandatory for apps published with app bundles — splits key management into two pieces, and understanding which piece does what turns a source of anxiety into a solved problem.

## The two keys, plainly

The app signing key is the identity of your app. It signs the APKs users install, and Android uses it to guarantee that an update genuinely comes from you. With Play App Signing, Google generates and holds this key in its own secure infrastructure. You never download it, never back it up, and — critically — cannot lose it.

The upload key is the credential you sign your bundle with when you upload it to Play Console. It proves to Google that the upload comes from the developer account holder. It lives wherever you keep it: a keystore file on your build machine, your CI secrets, a password manager's secure storage.

Every consequence flows from that split: the key that defines your app's identity is the one you cannot lose, and the key you can lose is the one that is replaceable.

## If you lose your upload key

This is the recoverable disaster. From Play Console (Setup → App signing), you can request an upload key reset: verify your identity as the account holder, generate a new upload key, and register its certificate. Uploads signed with the old key stop being accepted once the reset takes effect, so coordinate with your team and CI before you do it — but your app, its signing identity, and its update path all survive intact.

## The habits that prevent the disaster anyway

- Back the keystore up in two places that are not the same laptop: an encrypted backup in cloud storage and one offline copy. A keystore that exists only on a build machine is a scheduled emergency.
- Store the keystore password separately from the keystore. Together, in one text file, is the arrangement every breach story starts with.
- Document which key is which. Teams regularly archive the debug keystore, or a Play-generated certificate, and believe they have backed up the upload key. Label files with the app, the key type, and the certificate fingerprint (SHA-256) so anyone can verify what a file actually is.
- In CI, the upload key belongs in the CI secret store, never in the repository — including "temporarily," including private repos that will not stay private forever.

## One more thing: the certificate fingerprint is public and useful

Your app signing certificate's SHA-256 fingerprint is what you register with third-party services — Firebase, Google Sign-In, Maps, and deep-link verification (assetlinks.json) all key off the signing certificate, not your upload certificate. When an integration fails in production but worked in testing, the cause is very often this: the service has your upload or debug fingerprint registered, while production installs carry the Play app signing fingerprint. Check Setup → App signing in Play Console for the fingerprints Google actually ships with.

Two keys, two jobs, one backup habit. Play App Signing took the catastrophic failure mode off the table; the remaining risk is ordinary, manageable, and entirely in your filing system.`,
  },
];
