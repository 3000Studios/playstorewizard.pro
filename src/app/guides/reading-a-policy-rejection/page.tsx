import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "staged-rollouts-and-version-codes";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Every Android update you ship is governed by two simple mechanics that most developers only half understand until one of them bites: the version code, which decides whether a device is even allowed to update, and the staged rollout, which decides how many of your users get the update today versus next week. Get both right and releases become boring. Get either wrong and you will meet the special misery of users stranded on a broken build you cannot fix for them.</p>

      <h2>Version codes: the only number Google Play actually compares</h2>
      <p>Your app has two version identifiers. The version <em>name</em> (&quot;2.4.1&quot;) is cosmetic — users see it, Play ignores it for update logic. The version <em>code</em> is an integer Play compares mechanically: a device can only install a build whose version code is higher than the one it already has. Every upload to any track must have a version code higher than any build Play already knows about for your app, and a user can never be offered a lower version code than their installed one. There is no downgrade path on Google Play.</p>
      <p>This creates the classic trap: a developer tests a build with a carelessly high version code — say, a date-based code in the billions — on an internal track, then discovers every production release must now exceed it. Plan a scheme and keep it boring. Many teams use a simple incrementing integer managed by their build system (one more than the last, every build), or a structured scheme encoding major/minor/patch. Either works. What matters is that the number only ever goes up, every build gets a fresh one, and nobody hand-types it at release time.</p>

      <h2>Staged rollouts: shipping to a fraction first</h2>
      <p>When you release to production you do not have to give the update to everyone at once. A staged rollout lets you release to a percentage of your users — you pick the fraction — and increase it over time as confidence grows. Play selects which users are in the fraction; you cannot target specific individuals, but you can combine staging with country targeting on the release.</p>
      <p>The reason to stage is asymmetry of regret. If a release has a serious bug, a rollout halted at a small percentage means most users never saw it and your rating survives. The same bug at 100% rollout becomes your store listing&apos;s public face for weeks. A common cadence for meaningful updates is to start small, watch for a day or two, expand through the middle percentages, then complete — stretching or compressing the schedule based on how risky the change is. A text fix and a payments rewrite do not deserve the same rollout.</p>

      <h2>Halting, and what halting does not do</h2>
      <p>If the numbers turn against you, you can halt a staged rollout from Play Console. Halting stops <em>new</em> users from receiving the update. It does not — cannot — take the build back from users who already installed it. Those users keep the buggy version until you ship a fix with a higher version code. This is the second classic trap: a halted rollout feels like an undo button, but the affected cohort is frozen in place, filing the reviews and support tickets, until your fixed build reaches them. When you ship the fix, consider rolling it out to the affected population decisively rather than staging it as cautiously as the original — those users are already on the bad version; the risk calculus is different.</p>

      <h2>What to watch while a rollout runs</h2>
      <p>Play Console&apos;s Android vitals shows crash rate and ANR (app-not-responding) rate for your release; Google flags apps whose rates cross its bad-behavior thresholds, and elevated vitals can hurt your store visibility. Compare the new release&apos;s vitals against your previous version&apos;s, not against perfection — a small absolute rise concentrated in the new build is the signal that matters. Watch your review stream filtered to the new version, and your support inbox, for the first 48 hours. Also confirm the rollout is actually moving: check that installs on the new version code are climbing as expected for the percentage you set, so a stuck release is not mistaken for a quiet success.</p>

      <h2>Putting it together: a sane release checklist</h2>
      <p>Before the release: confirm the version code is exactly the next in sequence, the build was validated on a testing track as the identical AAB you are promoting, and your release notes describe what actually changed. At launch: choose a starting percentage matched to the change&apos;s risk, not your optimism. During: watch vitals and version-filtered reviews daily, expand on evidence, halt without hesitation if the new build&apos;s crash or ANR rate clearly separates from the old one. After full rollout: leave the release alone and record what happened — rollout dates, percentages, any halt — alongside the version code in your team&apos;s log. Six months from now, when someone asks why version 48 never reached half your users, that log is the only honest answer in the building.</p>
    </GuideLayout>
  );
}
