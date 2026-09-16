import type { Metadata } from "next";
import ProfileCard from "../../components/ui/ProfileCard";
import PageTitle from "../../components/ui/PageTitle";
import { generatePageMetadata } from "../../lib/i18n/metadata";
import GitHubCard from "../../components/features/GitHubCard";
import LastUpdateStatus from "../../components/features/LastUpdateStatus";
import IntroductionSection from "../../components/features/IntroductionSection";
import SkillsSection from "../../components/features/SkillsSection";
import AcgSection from "../../components/features/AcgSection";
import SponsorSection from "../../components/features/SponsorSection";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/about",
    titleKey: "about.pageTitle",
    descriptionKey: "about.description",
  });
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageTitle translationKey="about.title" />
      <div className="card p-6">
        <ProfileCard />
        {/* <GitHubCard /> */}

        <IntroductionSection />
        <SkillsSection />
        <AcgSection />
        <SponsorSection />

        <LastUpdateStatus
          buildTime={process.env.NEXT_PUBLIC_BUILD_TIME ?? ""}
        />
      </div>
    </div>
  );
}
