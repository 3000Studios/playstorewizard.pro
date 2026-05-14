/**
 * Privacy policy generator.
 *
 * Builds a real, hostable HTML privacy policy from the user's Data Safety
 * answers — not a generic template with TBD fields. The output references
 * specifically the data types the user said they collect.
 *
 * The policy is generated deterministically from the inputs (no AI). This
 * keeps it reproducible, defamation-safe, and free.
 */

export interface PrivacyPolicyInput {
  appName: string;
  developerName: string;
  contactEmail: string;
  websiteUrl?: string;
  jurisdiction?: string; // e.g. "California, USA" or "European Union"
  collectsData: boolean;
  sharesData: boolean;
  dataTypes: DataType[];
  /** Per-data-type purposes the user declared. */
  dataPurposes: Record<DataType, DataPurpose[]>;
  /** Whether the app uses ads. */
  usesAds: boolean;
  adNetworks?: string[];
  /** Whether the app uses analytics. */
  usesAnalytics: boolean;
  analyticsProviders?: string[];
  /** Account features. */
  allowsAccountCreation: boolean;
  hasInAppAccountDeletion: boolean;
  /** Children's data handling. */
  targetsChildren: boolean;
}

export type DataType =
  | "name" | "email" | "phone" | "address" | "user-ids" | "device-ids"
  | "location-approximate" | "location-precise"
  | "photos" | "videos" | "audio" | "files-and-docs"
  | "contacts" | "calendar" | "sms-mms" | "call-logs"
  | "health-fitness" | "financial-info" | "payment-info"
  | "purchase-history" | "credit-info"
  | "app-interactions" | "in-app-search-history"
  | "crash-logs" | "performance-data"
  | "diagnostic-info" | "other-app-performance-data"
  | "ip-address" | "browser-history"
  | "voice-recordings" | "racial-ethnic-data" | "political-info"
  | "religious-info" | "sexual-orientation";

export type DataPurpose =
  | "account-management" | "app-functionality" | "analytics"
  | "developer-communications" | "advertising-marketing"
  | "fraud-prevention" | "compliance" | "personalization";

const DATA_TYPE_LABELS: Record<DataType, string> = {
  "name": "Name",
  "email": "Email address",
  "phone": "Phone number",
  "address": "Physical address",
  "user-ids": "User ID",
  "device-ids": "Device or other IDs",
  "location-approximate": "Approximate location",
  "location-precise": "Precise location",
  "photos": "Photos",
  "videos": "Videos",
  "audio": "Audio recordings",
  "files-and-docs": "Files and documents",
  "contacts": "Contacts",
  "calendar": "Calendar entries",
  "sms-mms": "SMS or MMS messages",
  "call-logs": "Phone call logs",
  "health-fitness": "Health and fitness data",
  "financial-info": "Financial information",
  "payment-info": "Payment information",
  "purchase-history": "Purchase history",
  "credit-info": "Credit information",
  "app-interactions": "In-app interactions",
  "in-app-search-history": "In-app search history",
  "crash-logs": "Crash logs",
  "performance-data": "Performance data",
  "diagnostic-info": "Diagnostic information",
  "other-app-performance-data": "Other app performance data",
  "ip-address": "IP address",
  "browser-history": "Web browsing history",
  "voice-recordings": "Voice or sound recordings",
  "racial-ethnic-data": "Racial or ethnic information",
  "political-info": "Political or social opinions",
  "religious-info": "Religious beliefs",
  "sexual-orientation": "Sexual orientation",
};

const PURPOSE_LABELS: Record<DataPurpose, string> = {
  "account-management": "managing your account",
  "app-functionality": "providing the core features of the app",
  "analytics": "understanding how the app is used so we can improve it",
  "developer-communications": "sending you service updates and announcements",
  "advertising-marketing": "showing relevant advertising and marketing",
  "fraud-prevention": "preventing fraud and abuse",
  "compliance": "meeting legal and regulatory obligations",
  "personalization": "personalizing the app experience to you",
};

export function generatePrivacyPolicy(input: PrivacyPolicyInput): {
  html: string;
  plainText: string;
} {
  const date = new Date().toISOString().slice(0, 10);
  const sections: { title: string; html: string; text: string }[] = [];

  // ---- Intro ----
  sections.push({
    title: "Introduction",
    html: `<p>This Privacy Policy explains how ${escape(input.developerName)} ("we", "us", or "our") collects, uses, and protects information when you use the ${escape(input.appName)} mobile application (the "App"). By using the App, you agree to the practices described here.</p>${input.jurisdiction ? `<p>This policy is governed by the laws of ${escape(input.jurisdiction)}.</p>` : ""}`,
    text: `This Privacy Policy explains how ${input.developerName} collects, uses, and protects information when you use the ${input.appName} mobile application.${input.jurisdiction ? ` This policy is governed by the laws of ${input.jurisdiction}.` : ""}`,
  });

  // ---- Data we collect ----
  if (input.collectsData && input.dataTypes.length > 0) {
    const itemsHtml = input.dataTypes
      .map((dt) => {
        const purposes = input.dataPurposes[dt] ?? [];
        const purposeLabels = purposes.length > 0
          ? purposes.map((p) => PURPOSE_LABELS[p]).join(", ")
          : "providing the core features of the app";
        return `<li><strong>${escape(DATA_TYPE_LABELS[dt])}.</strong> Used for ${escape(purposeLabels)}.</li>`;
      })
      .join("");
    sections.push({
      title: "Information we collect",
      html: `<p>The App collects the following types of information:</p><ul>${itemsHtml}</ul>`,
      text: `The App collects the following types of information:\n${input.dataTypes.map((dt) => `  - ${DATA_TYPE_LABELS[dt]}`).join("\n")}`,
    });
  } else {
    sections.push({
      title: "Information we collect",
      html: `<p>The App does not collect personal information from users.</p>`,
      text: "The App does not collect personal information from users.",
    });
  }

  // ---- How we share data ----
  if (input.sharesData) {
    sections.push({
      title: "How we share information",
      html: `<p>We share information with third parties strictly for the purposes described in the previous section. We do not sell your personal information.</p>${input.usesAds && input.adNetworks?.length ? `<p>The App uses the following advertising partners: ${input.adNetworks.map(escape).join(", ")}.</p>` : ""}${input.usesAnalytics && input.analyticsProviders?.length ? `<p>The App uses the following analytics providers: ${input.analyticsProviders.map(escape).join(", ")}.</p>` : ""}`,
      text: `We share information with third parties strictly for the purposes described above. We do not sell your personal information.${input.usesAds && input.adNetworks?.length ? `\nAdvertising partners: ${input.adNetworks.join(", ")}.` : ""}${input.usesAnalytics && input.analyticsProviders?.length ? `\nAnalytics providers: ${input.analyticsProviders.join(", ")}.` : ""}`,
    });
  } else {
    sections.push({
      title: "How we share information",
      html: `<p>We do not share information with any third parties.</p>`,
      text: "We do not share information with any third parties.",
    });
  }

  // ---- Account deletion ----
  if (input.allowsAccountCreation) {
    sections.push({
      title: "Your account and data deletion",
      html: input.hasInAppAccountDeletion
        ? `<p>You can delete your account and all associated data at any time from within the App's settings. This will permanently remove your personal information from our systems within 30 days, except where retention is required by law.</p>`
        : `<p>To request deletion of your account and personal data, please email <a href="mailto:${escape(input.contactEmail)}">${escape(input.contactEmail)}</a>. We will process the request within 30 days.</p>`,
      text: input.hasInAppAccountDeletion
        ? "You can delete your account and all associated data at any time from within the App's settings."
        : `To request deletion of your account, email ${input.contactEmail}.`,
    });
  }

  // ---- Children ----
  if (input.targetsChildren) {
    sections.push({
      title: "Children's privacy",
      html: `<p>The App is designed for children under 13 (or the equivalent age in your jurisdiction). We comply with the Children's Online Privacy Protection Act (COPPA) and the EU General Data Protection Regulation's special provisions for children. We do not knowingly collect personal information from children without verifiable parental consent. Parents can request review or deletion of their child's data at <a href="mailto:${escape(input.contactEmail)}">${escape(input.contactEmail)}</a>.</p>`,
      text: `The App is designed for children. We comply with COPPA and GDPR provisions for children. Parents can contact ${input.contactEmail} for review or deletion of their child's data.`,
    });
  } else {
    sections.push({
      title: "Children's privacy",
      html: `<p>The App is not directed at children under 13. We do not knowingly collect information from children under 13. If you believe we have inadvertently collected such information, please contact us at <a href="mailto:${escape(input.contactEmail)}">${escape(input.contactEmail)}</a> and we will delete it.</p>`,
      text: `The App is not directed at children under 13. Contact ${input.contactEmail} if you believe we have inadvertently collected children's data.`,
    });
  }

  // ---- Security ----
  sections.push({
    title: "Security",
    html: `<p>We use industry-standard technical and organizational measures to protect your information, including encryption in transit and at rest where applicable. No method of electronic storage is 100% secure, however, and we cannot guarantee absolute security.</p>`,
    text: "We use industry-standard technical and organizational measures to protect your information, including encryption in transit and at rest where applicable.",
  });

  // ---- Your rights ----
  sections.push({
    title: "Your rights",
    html: `<p>Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict the use of your personal information, and to withdraw consent at any time. To exercise these rights, contact us at <a href="mailto:${escape(input.contactEmail)}">${escape(input.contactEmail)}</a>.</p>`,
    text: `You may have the right to access, correct, delete, or restrict the use of your personal information. Contact ${input.contactEmail} to exercise these rights.`,
  });

  // ---- Changes ----
  sections.push({
    title: "Changes to this policy",
    html: `<p>We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page shows when the latest changes took effect. Continued use of the App after changes constitutes acceptance of the updated policy.</p>`,
    text: "We may update this policy. Continued use of the App after changes constitutes acceptance.",
  });

  // ---- Contact ----
  sections.push({
    title: "Contact us",
    html: `<p>For questions about this policy, contact ${escape(input.developerName)} at <a href="mailto:${escape(input.contactEmail)}">${escape(input.contactEmail)}</a>${input.websiteUrl ? ` or visit <a href="${escape(input.websiteUrl)}">${escape(input.websiteUrl)}</a>` : ""}.</p>`,
    text: `Contact ${input.developerName} at ${input.contactEmail}${input.websiteUrl ? ` or visit ${input.websiteUrl}` : ""}.`,
  });

  // ---- Assemble HTML ----
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(input.appName)} Privacy Policy</title>
<style>
  body { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; line-height: 1.65; max-width: 720px; margin: 2rem auto; padding: 1rem; color: #1f2937; }
  h1 { font-size: 2rem; margin-bottom: .25rem; }
  h2 { font-size: 1.25rem; margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid #e5e7eb; }
  .meta { color: #6b7280; font-size: .9rem; margin-bottom: 2rem; }
  ul { padding-left: 1.5rem; }
  li { margin-bottom: .5rem; }
  a { color: #4f46e5; }
</style>
</head>
<body>
<h1>${escape(input.appName)} Privacy Policy</h1>
<p class="meta">Last updated: ${date}</p>
${sections.map((s) => `<h2>${escape(s.title)}</h2>\n${s.html}`).join("\n")}
</body>
</html>`;

  // ---- Assemble plain text ----
  const plainText =
    `${input.appName} Privacy Policy\nLast updated: ${date}\n\n` +
    sections.map((s) => `${s.title.toUpperCase()}\n\n${s.text}`).join("\n\n");

  return { html, plainText };
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
