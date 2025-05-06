// Internal config
import { config } from "@/config";

interface HowToMintSectionProps {}

export const HowToMintSection: React.FC<HowToMintSectionProps> = () => {
  if (!config.howToMint) return null;

  return (
    <section className="how-to-mint-container px-4 text-center max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
      <h2 className="heading-md">{config.howToMint.title}</h2>

      <ol className="flex flex-col md:flex-row items-center md:justify-between pt-6 gap-6">
        {config.howToMint.steps.map((text: string, index: number) => (
          <li key={index} className="flex items-center gap-4 basis-1/5">
            <span className="title-md text-secondary-text">{index + 1}</span>
            <p className="body-sm text-left">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};
