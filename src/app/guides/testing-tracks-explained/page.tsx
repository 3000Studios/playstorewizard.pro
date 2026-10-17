import { GuideLayout } from "@/components/content/guide-layout";
import { pageMetadata } from "@/lib/seo/metadata";
import { getGuide } from "@/lib/content/guides";

const SLUG = "testing-tracks-explained";
const guide = getGuide(SLUG);
export const metadata = pageMetadata({ title: guide?.title ?? "", description: guide?.summary ?? "", path: `/guides/${SLUG}` });

export default function Page() {
  return (
    <GuideLayout slug={SLUG}>
      <p>Google Play gives every app three testing tracks — internal, closed, and open — plus the production track. They look similar in Play Console, and developers regularly lose weeks using the wrong one: teams recruit hundreds of strangers into an internal test that caps at a hundred, or try to satisfy the closed-testing requirement for production access using an open test that does not count. Here is what each track is actually for and how releases move between them.</p>

      <h2>Internal testing: your team, right now</h2>
      <p>Internal testing is the fastest, smallest track. You can share a build with up to 100 testers, they get access almost immediately through an opt-in link, and releases on this track do not go through the same review queue as production submissions. This is the track for your own devices, your team, your QA pass, and anyone who needs the build today rather than next week.</p>
      <p>Use internal testing for smoke tests of every release candidate, for checking that the AAB you are about to promote actually installs and runs from Play (rather than from Android Studio), and for sharing work-in-progress with stakeholders. What it is not for: gathering outside feedback at any scale, or satisfying any formal testing requirement. Builds here are invisible to the public store listing, and testers must be added by email address or Google Group.</p>

      <h2>Closed testing: controlled groups and the production gate</h2>
      <p>Closed testing is the track for managed beta groups. You create one or more closed tracks (commonly called alpha, beta, or by audience), add testers by email list or Google Group, and releases go through review before testers receive them. Testers join through an opt-in link and see the app in the Play Store with a note that it is a private test version.</p>
      <p>Closed testing carries an extra weight for newer developers: personal developer accounts created after November 13, 2023 must run a closed test with at least 12 testers opted in for 14 consecutive days before they can apply for production access. If that rule applies to you, the details matter — the testers must be on a closed track specifically, they must stay opted in for the full period, and losing testers mid-run can restart your clock. We cover that requirement in depth in our dedicated guide to the 12-tester, 14-day rule; the short version is that an open test or an internal test does not satisfy it, no matter how many people install the build.</p>
      <p>Beyond the requirement, closed testing is the right home for staged betas with specific audiences: your Discord community, your early-access mailing list, a client reviewing their white-label build. Run multiple closed tracks in parallel when different audiences need different builds.</p>

      <h2>Open testing: a public beta on your store listing</h2>
      <p>Open testing puts a beta version directly on your public Play Store listing. Anyone can join, install the beta, and leave feedback through a private channel rather than public reviews. You can cap the number of testers if you want scarcity, but the defining trait is discoverability: this is a beta that markets your app while it tests it.</p>
      <p>Open testing suits apps that are fundamentally ready for strangers — the onboarding works, the crashes are under control — and that benefit from volume: compatibility across many devices, load on your backend, and a pipeline of engaged users ready for launch day. It is the wrong tool while the app still embarrasses you, because open testers are real users forming first impressions, and it does not count toward the closed-testing requirement for new personal accounts.</p>

      <h2>How releases move between tracks</h2>
      <p>Tracks are not silos; a release built once can be promoted. The normal pipeline for a careful team looks like this: build lands on internal testing for the team&apos;s smoke test; the same build is promoted to a closed track for the beta group; after a clean period there, it is promoted to production, ideally as a staged rollout. Promoting reuses the exact same AAB, which matters — the artifact your testers validated is byte-for-byte the artifact users receive, not a rebuild that might differ.</p>
      <p>Two mechanics to internalize. First, version codes rule everything: a tester receives the highest version code available to them across all tracks they belong to, so a higher-version internal build will override your production release for anyone on the internal list. Second, tracks can hold different live releases simultaneously — your production users, closed beta group, and internal team can all be running different builds at the same time, which is exactly the point, but it means your support team needs to ask &quot;which version?&quot; before debugging anything.</p>

      <h2>Choosing quickly</h2>
      <p>If the audience is your own team and speed matters, it is internal. If the audience is a named group you control — or you are a newer personal account working toward production access — it is closed. If the audience is the public and the app is ready to be judged, it is open. Most healthy apps use all three in sequence for every significant release. The developers who get stuck are the ones who treat the tracks as interchangeable, and discover the difference at the worst possible moment: launch week.</p>
    </GuideLayout>
  );
}
