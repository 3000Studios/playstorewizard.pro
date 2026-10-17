import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "reading-a-policy-rejection";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Almost every developer gets the email eventually. Your submission was rejected, or worse, your live app was removed. The message from Google is formal, links a policy, and does not read like it was written by a person who looked at your app for very long. Your first job is not to fix anything or appeal anything. Your first job is to figure out which of several very different situations you are actually in, because the right response to each one is different.</p>

      <h2>Rejection, removal, suspension: three different problems</h2>
      <p>A <strong>rejection</strong> means a new app or update you submitted was not approved. Your existing live version (if you have one) is untouched, nobody lost access, and the fix is usually straightforward: change what was flagged and resubmit. Rejections are a normal part of publishing and carry no lasting penalty when they are occasional and addressed properly.</p>
      <p>A <strong>removal</strong> means a live app (or a specific version of it) was taken off the store for a policy violation. Users who already installed it generally keep it, but nobody new can download it until you submit a compliant update and it is approved. Removals matter more than rejections because the violation was in something already public.</p>
      <p>A <strong>suspension</strong> is the severe one. Suspended apps are pulled entirely, the listing is gone, and suspensions count as strikes against your developer account. Suspensions are reserved for serious or repeated violations, and repeated suspensions can lead to account termination. If your email says &quot;suspended,&quot; slow down, read everything twice, and do not create a new developer account to try to route around it — Google treats that as a violation in itself and it permanently poisons your options.</p>

      <h2>Where the real information lives</h2>
      <p>The email is a summary. The details are in Play Console, on the <strong>Policy status</strong> page (under App content / Policy in the console). That page lists each enforcement action, the policy cited, the date, and the appeal deadline if one applies. Read the cited policy itself — the full text, not just the paragraph quoted in the email. Rejection notices quote the relevant section, but the surrounding policy text often contains the specific exception, example, or requirement that determines whether your app actually violates it or was flagged by mistake.</p>
      <p>Pay attention to <em>where</em> the violation is located. A surprising share of rejections are not about your app&apos;s binary at all. They are about your store listing: a screenshot showing a feature the app does not have, a description claiming functionality that is not there, a feature graphic implying an endorsement. Others are about metadata inside the app — a privacy policy link that is dead, a data safety answer that contradicts what your SDKs actually collect. The Policy status page and the rejection details tell you which surface was flagged; fix that surface, not a random other one.</p>

      <h2>Fix it or appeal it?</h2>
      <p>Most rejections should simply be fixed. If the notice says your app requests a sensitive permission without a declaration, submit the declaration or remove the permission. If a screenshot is misleading, replace the screenshot. Fixing is faster than appealing in nearly every case where the flag is accurate, and accurate flags are the majority.</p>
      <p>Appeal when you believe the enforcement is factually wrong: the policy cited does not say what the reviewer claims it says, your app does not do the thing described, or the flagged content belongs to a category the policy explicitly permits. Appeals are a real channel — Play Console gives you an appeal action on the Policy status page for eligible enforcement actions — but an appeal is not a request for a second opinion on a judgment call. It is a claim that a mistake was made, and it should be written that way.</p>

      <h2>What a good appeal actually contains</h2>
      <p>Keep it short, specific, and evidence-based. State which policy was cited and quote the exact part of it your app complies with. Describe precisely what your app does in the flagged area — walk the reviewer through the user flow step by step, because the reviewer&apos;s misunderstanding usually lives in one specific step. If the issue involves a declaration or permission, attach or reference the documentation that supports your use case. If you changed anything in response to the notice, say exactly what changed and where.</p>
      <p>What does not help: repeating that your app is high quality, citing your download counts or ratings, threatening to move to another platform, or resubmitting the identical build with an appeal note hoping for a different reviewer. Also avoid submitting a dozen follow-ups. One clear appeal with evidence beats five emotional ones, and flooding the queue does not speed anything up.</p>

      <h2>The resubmission traps</h2>
      <p>When you fix and resubmit, three traps catch developers repeatedly. First, resubmitting with the violation only partially fixed — you removed the flagged screen but the same claim is still in your description text. Reviewers check the whole surface. Second, fixing the flagged item and unknowingly introducing a new one, such as swapping in a screenshot from a different app. Third, for removals: submitting an update before the underlying issue is resolved in <em>all</em> tracks. If the violating version is also sitting in a testing track or your app bundle contains the flagged content in an inactive feature module, resolve it everywhere.</p>
      <p>One more habit that saves grief later: keep a simple log of every enforcement action — date, policy, what you changed, outcome. If a pattern ever develops, that log is the difference between demonstrating good faith with documentation and trying to reconstruct history from old emails. Most single rejections are speed bumps. Handle them precisely, and they stay that way.</p>
    </GuideLayout>
  );
}
