// Internal components
import { buttonVariants } from "@/components/ui/button";
import { TriImageBanner } from "@/pages/Mint/components/TriImageBanner";
// Internal config
import { config } from "@/config";

interface OurStorySectionProps {}

export const OurStorySection: React.FC<OurStorySectionProps> = () => {
  if (!config.ourStory) return null;

  return (
    <section className="our-story-container px-4 flex flex-col md:flex-row gap-6 max-w-screen-xl mx-auto w-full items-center bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
      <div className="basis-3/5">
        <p className="label-sm">{config.ourStory.subTitle}</p>
        <h2 className="heading-md">An Ever-Growing Community Ledger</h2>
        <p className="body-sm pt-2">Every page you mint is an indelible contribution to a living, breathing digital tapestry. Express yourself, share your vision, and permanently record your creative legacy. Every minted page is a unique part of our collective story, preserved forever on-chain, minted proudly with 📒 tokens. Join our vibrant community and make your mark today!</p>
        {config.socials?.discord && (
          <a
            href={config.socials.discord}
            target="_blank"
            className={buttonVariants({
              variant: "outline",
              className: "mt-4",
            })}
          >
            Join Our Community
          </a>
        )}
      </div>

      {config.ourStory.images && config.ourStory.images?.length > 0 && (
        <TriImageBanner className="basis-2/5" />
      )}
    </section>
  );
};
