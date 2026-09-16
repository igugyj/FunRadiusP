// components/features/SkillsSection.tsx
import LogoLoop from "../reactbits/LogoLoop";
import {
  coreSkillsLogos,
  frameworksLogos,
  preferredToolsLogos,
  infrequentSkillsLogos,
  otherToolsLogos,
} from "../../lib/about-skills";

const categories = [
  { title: "Core Skills", logos: coreSkillsLogos },
  { title: "Frameworks", logos: frameworksLogos },
  { title: "Preferred Tools", logos: preferredToolsLogos },
  { title: "Infrequent Skills", logos: infrequentSkillsLogos },
  { title: "Other Tools", logos: otherToolsLogos },
] as const;

export default function SkillsSection() {
  return (
    <section className="my-8 space-y-6">
      <h2 className="text-xl font-bold">Skills &amp; Tools</h2>

      {categories.map(({ title, logos }) => (
        <div key={title}>
          <h3 className="text-base font-semibold mb-3 opacity-80">{title}</h3>
          <LogoLoop
            logos={logos}
            speed={60}
            direction="left"
            logoHeight={28}
            gap={24}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="var(--background)"
            ariaLabel={title}
          />
        </div>
      ))}
    </section>
  );
}
