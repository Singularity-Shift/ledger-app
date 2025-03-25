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
    <section className="our-team-container px-4 text-center max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg border-2 border-black shadow-lg">
      <h2 className="heading-md">{config.ourTeam.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 max-w-2xl mx-auto">
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
    <Card className="px-4 py-4 w-full flex flex-col items-center gap-3" shadow="md">
      <Image src={img} rounded className="aspect-square object-cover max-w-28" />
      <div className="flex flex-col gap-1">
        <p className="text-center subtitle-1">{name}</p>
        <p className="text-center body-sm text-secondary-text">{role}</p>
      </div>
      {socials?.twitter && (
        <a className={buttonVariants({ variant: "link", className: "px-0 py-0" })} href={socials.twitter} target="_blank">
          <Image src={Twitter} className="dark:invert" />
        </a>
      )}
    </Card>
  );
};
