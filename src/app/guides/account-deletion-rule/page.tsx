import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "account-deletion-rule";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>If your app allows users to create accounts, you must provide an in-app way to delete those accounts and the associated data. Not just a support email. Not just a deletion request form on your website. A button inside the app, reachable in a reasonable number of taps, that triggers actual data deletion. This rule has been enforced since 2023 and trips up a surprising number of apps with login flows.</p>

      <h2>Who the rule applies to</h2>
      <p>Any app where users can create accounts. The definition is broad: account creation includes traditional username/password signup, Sign in with Google, Sign in with Apple, Sign in with Facebook, magic-link email auth, SMS one-time codes, and any other flow that establishes a persistent server-side identity for the user.</p>
      <p>Apps that don&apos;t have accounts at all (offline calculators, single-player games with no backend, utilities that store data only locally) are exempt. Apps where the only persistent identifier is a non-resettable device ID — i.e., apps that track users but don&apos;t let users authenticate — are technically exempt from this rule but have their own privacy issues to address.</p>

      <h2>What &quot;in-app deletion&quot; means in practice</h2>
      <p>The deletion control must be findable and usable inside the app, without leaving the app. Common implementations:</p>
      <ul>
        <li>A &quot;Delete account&quot; button in account settings.</li>
        <li>A &quot;Manage account&quot; section in the user profile menu with a deletion option.</li>
        <li>A confirmation flow — typing the word DELETE, entering the password, or otherwise demonstrating intent — before the deletion executes.</li>
      </ul>
      <p>What does NOT satisfy the rule:</p>
      <ul>
        <li>A &quot;Contact support to delete&quot; message.</li>
        <li>A link that opens an external browser to a deletion form.</li>
        <li>A &quot;Sign out&quot; option without an associated deletion option.</li>
        <li>A flow that requires multiple confirmation emails or human review before executing the deletion.</li>
      </ul>

      <h2>What deletion actually has to do</h2>
      <p>Once the user confirms deletion, your backend must delete or anonymize the user&apos;s personally identifiable data within a reasonable timeframe — typically 30 days. The user&apos;s account record can be retained as a deleted-account stub for audit purposes, but identifiable data (name, email, profile content, message history) must go.</p>
      <p>Exceptions: data you&apos;re legally required to retain (financial records, tax data, regulated-industry retention) can be kept and isolated. Data that&apos;s anonymized irreversibly (aggregated analytics, ML training data without identifiers) can be kept. Free-text content others rely on (comments on shared threads) can be reassigned to a generic &quot;Deleted user&quot; identity rather than removed wholesale.</p>

      <h2>External deletion paths</h2>
      <p>In addition to the in-app option, you must also provide an externally accessible deletion path — typically a web form linked from your privacy policy. This serves users who&apos;ve uninstalled the app, lost device access, or want to verify deletion without reinstalling. The web form must accept account-identifying info and trigger the same backend deletion as the in-app button.</p>

      <h2>Account deletion in the Data Safety form</h2>
      <p>The Data Safety form has a specific question about deletion: &quot;Do you provide a way for users to request that their data is deleted?&quot; Answer yes only if both the in-app and external paths exist. Misreporting here triggers a re-review.</p>

      <h2>Common implementation mistakes</h2>
      <p>Even teams that build account deletion correctly often get it wrong in subtle ways:</p>
      <ul>
        <li><strong>Auth-token only deletion.</strong> The delete button removes the user&apos;s session but doesn&apos;t actually trigger a backend delete. Reviewers test this by re-logging in with the same credentials after deletion and finding the account still works.</li>
        <li><strong>Deletion that requires the user to be signed in but not verified.</strong> If your auth tokens have a long lifetime and never re-prompt for password, a stolen device can trigger account deletion by a malicious party. Re-authenticate before destructive actions.</li>
        <li><strong>Race conditions.</strong> If your backend deletes user data but background jobs continue to process it (push notifications, scheduled emails), data leaks back into the user&apos;s lived experience after deletion.</li>
      </ul>

      <h2>How the wizard handles this</h2>
      <p>The Data Safety step (Step 7) asks whether your app allows account creation. If yes, it follows up with whether you have in-app account deletion. If you don&apos;t, the compliance check in Step 12 flags this as a blocker and links to this guide for implementation guidance.</p>
    </GuideLayout>
  );
}
