import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "closed-testing-12-testers-14-days";
const guide = getGuide(SLUG);

export const metadata = pageMetadata({
  title: guide?.title ?? "",
  description: guide?.summary ?? "",
  path: `/guides/${SLUG}`,
});

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>If you signed up for a personal Google Play developer account on or after November 13, 2023, you cannot publish your first app directly to production. You must first run a closed test with at least 12 testers continuously opted in for 14 consecutive days, then apply for production access and wait for human review. There is no shortcut, no workaround, and no exception for solo developers, small apps, or polished products. This is the most-disliked Google Play rule of the past two years, and it&apos;s here to stay. Here&apos;s how to satisfy it without losing weeks.</p>

      <h2>Why this rule exists</h2>
      <p>Google introduced the rule to combat low-quality and fraudulent submissions from accounts spun up specifically to publish junk. The hypothesis: making real-world testing a precondition of production access raises the cost of bad-faith submissions enough to reduce volume. Whether the policy actually works at that goal is debated, but its enforcement is consistent and strict.</p>
      <p>Organization accounts are exempt because Google considers the registered-entity verification a sufficient quality filter on its own.</p>

      <h2>The rule in exact terms</h2>
      <p>To unlock production access for your first app on a personal account, you need:</p>
      <ul>
        <li>An active closed-testing track with at least 12 testers opted in.</li>
        <li>Those 12 testers must remain continuously opted in for 14 consecutive days. If any tester drops below 12 at any point, the clock starts over.</li>
        <li>The test must remain live and the app accessible to testers throughout the period.</li>
        <li>After 14 days, you apply for production access. Google reviews the application — this can take anywhere from a day to two weeks, depending on backlog and the perceived risk of your app.</li>
      </ul>

      <h2>Setting up the closed test</h2>
      <p>Inside Play Console: <em>Testing &rarr; Closed testing &rarr; Create new track</em>. Name the track something memorable — it&apos;s purely internal. Upload your AAB. Then add the listing fields the closed track requires: a small set of metadata, smaller than the full production listing.</p>
      <p>The crucial part is the <em>Testers</em> tab. You have two options for adding testers:</p>
      <ol>
        <li><strong>Email list.</strong> Paste up to 100 email addresses (Google or Gmail accounts only). Each address gets a private opt-in link via Google. Until they click it and accept, they don&apos;t count toward your 12.</li>
        <li><strong>Google Group.</strong> Create a public Google Group, add it to the closed-testing tester field, and anyone who joins the group counts. This is the easier path if you&apos;re recruiting outside your immediate circle.</li>
      </ol>

      <h2>Recruiting the 12</h2>
      <p>This is where solo developers struggle. Twelve real testers willing to install your app and keep it installed for two weeks is a non-trivial ask if you do not already have an audience.</p>
      <p>Things that work:</p>
      <ul>
        <li><strong>Trade testing slots with other indie devs.</strong> Communities like r/androiddev, the Indie Hackers forum, and indie-dev Discord servers have dedicated channels for tester-swapping. You install their app, they install yours. Treat this as an ongoing reciprocity arrangement, not a transaction.</li>
        <li><strong>Recruit from your existing audience.</strong> If you have a newsletter, Twitter following, blog, or any community of people who already trust you, send a personal note offering early access. People who like you will give you 14 days.</li>
        <li><strong>Family and close friends with Android phones.</strong> Set realistic expectations: they need to (a) accept the opt-in email, (b) install the test build from Play Store using the special link, and (c) not uninstall for two weeks. This is harder than it sounds — people uninstall apps casually.</li>
      </ul>
      <p>What doesn&apos;t work: paid services that promise to provide testers for a fee. Google detects unnatural test patterns (devices with no other apps, accounts created in bulk, geographic clustering) and has been known to reject production access applications that look bought. The financial risk is small, but the time cost of failing the application and starting over is huge.</p>

      <h2>What &quot;continuously opted in&quot; actually means</h2>
      <p>This is the part that trips people up. The 14-day clock does not run from the date you created the track. It runs from the date you first had 12 simultaneously opted-in testers. If you reach 12, then a tester opts out or has their Google account deactivated, you drop to 11 and the timer resets.</p>
      <p>To stay safe, recruit 15 testers, not 12. Three buffer slots cover normal attrition. Watch the Testers tab daily for the first few days — the count is shown there in real time.</p>

      <h2>What testers actually need to do</h2>
      <p>Once a tester accepts the opt-in email, they install your app via a special Play Store link that only works for opted-in testers. From their perspective, the install experience is identical to a normal Play Store install. They do not need to file bug reports, write reviews, or anything else — they just need to remain opted in.</p>
      <p>Encouraging engagement helps your production-access application later — Google looks at how many testers opened the app, how often, and for how long. Tester reviews on the closed-track listing also help, even though they don&apos;t appear on the public production listing.</p>

      <h2>Applying for production access</h2>
      <p>After 14 continuous days, the <em>Apply for production access</em> button activates in Play Console. The application asks: how many testers you had, what feedback you received, what you changed based on the feedback, and any non-test outreach you&apos;ve done about the app.</p>
      <p>Write thoughtful answers. Generic responses like &quot;tested and ready&quot; lead to slower review or rejection. Concrete answers — &quot;testers reported the onboarding flow was confusing; rewrote the first two screens; tester engagement increased from 35% DAU to 62% DAU in the second week&quot; — get faster approval.</p>

      <h2>How long the review takes</h2>
      <p>Google reviews most production-access applications within 1–7 days. Some take longer, especially around major holidays or when Google rolls out new policy changes. There is no expedited path. The Play Console help docs say &quot;up to 14 days&quot; as a worst case, but in our observation most clear in under a week.</p>

      <h2>What happens if you&apos;re rejected</h2>
      <p>Google may reject your production-access application with vague reasoning (&quot;we need more evidence of real-world testing&quot;). Common fixes: run the closed test for longer (3–4 weeks is more convincing than 2), recruit more testers (20+ looks more legitimate than 12), or address any specific feedback in the rejection email.</p>
      <p>You can resubmit after addressing the issues. There is no fixed cooldown, but back-to-back identical resubmissions hurt your case. Make visible changes before reapplying.</p>

      <h2>How the wizard helps</h2>
      <p>The wizard tracks your closed-testing state across sessions. When you reach Step 11 (Release), if your account is personal and you have not completed the 14-day window, the wizard suggests starting on the closed track and reminds you of the deadline. The compliance check in Step 12 will not flag production-track submissions as ready until the rule is satisfied.</p>
    </GuideLayout>
  );
}
