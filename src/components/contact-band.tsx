import { getPageContent } from "@/lib/settings-store";
import { ButtonLink } from "./ui";

export async function ContactBand({ alliance = false }: { alliance?: boolean }) {
  const content = await getPageContent("global");
  const band = content.contactBand;
  return (
    <section className="contact-band">
      <div className="wrap flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <div>
          <h2 className="section-title">{alliance ? band.allianceTitle : band.homeTitle}</h2>
          <p className="mt-6 text-white/70">{alliance ? band.allianceText : band.homeText}</p>
        </div>
        <ButtonLink href={alliance ? "/contact?type=alliance" : "/contact"} light outline>
          {alliance ? band.allianceCta : band.homeCta}
        </ButtonLink>
      </div>
    </section>
  );
}
