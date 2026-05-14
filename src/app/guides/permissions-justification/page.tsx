import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "permissions-justification";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Some Android permissions trigger extra Google Play scrutiny — background location, SMS access, contacts, accessibility services. Declaring one of them in your manifest puts your submission in a special review queue, where a human reviewer evaluates whether your justification matches your app&apos;s declared functionality. This guide explains which permissions trigger the queue, what justifications work, and how to write the manifest declaration so it survives review.</p>

      <h2>The sensitive permissions</h2>
      <p>Google maintains a list of high-risk permissions whose use triggers extra review:</p>
      <ul>
        <li><strong>Background location</strong> (<code>ACCESS_BACKGROUND_LOCATION</code>): collecting location while the app is not visible.</li>
        <li><strong>SMS</strong> (<code>READ_SMS</code>, <code>SEND_SMS</code>, <code>RECEIVE_SMS</code>): reading or sending text messages.</li>
        <li><strong>Call log</strong> (<code>READ_CALL_LOG</code>, <code>WRITE_CALL_LOG</code>): reading or modifying the call history.</li>
        <li><strong>Contacts</strong> (<code>READ_CONTACTS</code>, <code>WRITE_CONTACTS</code>): accessing the device&apos;s contact list.</li>
        <li><strong>Accessibility services</strong> (<code>BIND_ACCESSIBILITY_SERVICE</code>): a powerful permission designed for assistive tech that is frequently abused by overlay malware.</li>
        <li><strong>Manage external storage</strong> (<code>MANAGE_EXTERNAL_STORAGE</code>): full filesystem access, mostly deprecated in favor of scoped storage.</li>
        <li><strong>Package usage stats</strong> (<code>PACKAGE_USAGE_STATS</code>): reading which apps the user has used and for how long.</li>
        <li><strong>Install packages</strong> (<code>REQUEST_INSTALL_PACKAGES</code>): triggering installation of other APKs.</li>
      </ul>

      <h2>What &quot;justification&quot; means</h2>
      <p>When you declare one of these permissions, Play Console prompts you to fill out a declaration form. You explain: (1) which feature requires the permission, (2) what data is accessed, (3) whether the access happens in the background, (4) whether the data is shared with third parties, and (5) whether there is a less-invasive alternative you considered.</p>
      <p>Reviewers compare your declaration to your app&apos;s actual behavior (via the AAB&apos;s code paths and any test logins they perform). Mismatches result in rejection.</p>

      <h2>What gets approved</h2>
      <p><strong>Background location.</strong> Approved for: fitness tracking apps that record routes, ride-sharing apps that show driver location, asset-tracking apps for fleets, emergency-services apps. Rejected for: weather apps (use foreground location), social apps that share location periodically (use foreground), generic utility apps with vague location use.</p>
      <p><strong>SMS.</strong> Approved for: messaging apps that handle SMS as their primary user-facing feature, account-recovery flows for apps where SMS verification is integral, banking apps that read SMS OTPs as a fallback to push notifications. Rejected for: anything else, including apps that &quot;just want to read confirmation codes for the user&apos;s convenience&quot;.</p>
      <p><strong>Contacts.</strong> Approved for: communication apps where the user explicitly invites contacts to join, contact-management apps that are the user&apos;s primary phonebook. Rejected for: growth-hacking import flows that upload contacts to the developer&apos;s servers, social apps that pre-populate friend suggestions from contacts.</p>
      <p><strong>Accessibility services.</strong> Approved only for: actual assistive technology serving users with disabilities, screen readers, alternative-input apps. Rejected for: automation tools, password managers (use autofill API instead), parental-control apps (use Family Link API).</p>
      <p><strong>Call log.</strong> Approved for: dialer/contacts replacement apps. Rejected for everything else.</p>
      <p><strong>Manage external storage.</strong> Approved for: file managers, backup utilities, antivirus apps. Rejected for: any app that could use scoped storage instead.</p>

      <h2>The runtime UX</h2>
      <p>Approval at submission is just the first hurdle. At runtime, users see permission prompts and may decline. Your app must handle declined permissions gracefully — disable the dependent feature, show a clear explanation, and avoid asking again immediately.</p>
      <p>Prompting for a sensitive permission too early in the user flow (before the user understands why) is a separate policy violation. The recommended pattern: trigger the permission request from the specific UI control that needs it, not from app launch.</p>

      <h2>How the wizard handles this</h2>
      <p>The bundle parser reads your declared permissions from the manifest. The compliance check in Step 12 flags any sensitive permission and asks for your justification text. The text gets formatted into the Play Console declaration form when you reach Step 12 (Review), so you can paste it directly when you submit.</p>
    </GuideLayout>
  );
}
