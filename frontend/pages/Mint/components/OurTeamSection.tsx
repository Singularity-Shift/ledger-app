import { FC } from "react";
// Internal components
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { ConfigTeamMember, config } from "@/config";
// Internal assets
import Twitter from "@/assets/icons/twitter.svg";
// External libs
import { buttonVariants } from "@/components/ui/button";

interface OurTeamSectionProps {}

export const OurTeamSection: FC<OurTeamSectionProps> = () => {
  if (!config.ourTeam || !config.ourTeam.members || config.ourTeam.members.length === 0) return null;

  return (
    <section className="our-team-container px-3 md:px-4 text-center max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-3 md:p-4 rounded-lg border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
      <h2 className="heading-md mb-2 md:mb-0">{config.ourTeam.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 pt-3 md:pt-6 max-w-2xl mx-auto">
        {config.ourTeam.members.map((person, index) => (
          <TeamMemberCard key={index} person={person} />
        ))}
      </div>
    </section>
  );
};

const TeamMemberCard: FC<{ person: ConfigTeamMember }> = ({ person }) => {
  const { name, role, img, socials } = person;

  return (
    <Card className="px-3 md:px-4 py-3 md:py-4 w-full flex flex-col items-center gap-2 md:gap-3 shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgb(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
      <Image src={img} rounded className="aspect-square object-cover w-20 md:w-28" />
      <div className="flex flex-col gap-0.5 md:gap-1">
        <p className="text-center body-md-semibold">{name}</p>
        <p className="text-center body-sm text-secondary-text">{role}</p>
      </div>
      {socials?.twitter && (
        <a className={buttonVariants({ variant: "link", className: "px-0 py-0 mt-1" })} href={socials.twitter} target="_blank">
          <Image src={Twitter} className="dark:invert w-4 h-4 md:w-5 md:h-5" />
        </a>
      )}
    </Card>
  );
};
