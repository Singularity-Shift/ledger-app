// Internal components
import { Card } from "@/components/ui/card";
// Internal utils
import { clampNumber } from "@/utils/clampNumber";
// Internal hooks
import { useGetCollectionData } from "@/hooks/useGetCollectionData";

interface StatsSectionProps {}

export const StatsSection: React.FC<StatsSectionProps> = () => {
  const { data } = useGetCollectionData();
  const { totalMinted = 0, uniqueHolders = 0 } = data ?? {};

  return (
    <section className="stats-container px-3 md:px-4 max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-3 md:p-4 rounded-lg border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
      <ul className="flex flex-col md:flex-row gap-3 md:gap-6">
        {[
          { title: "Collection Size", value: totalMinted },
          { title: "Wallets Participated", value: uniqueHolders },
          { title: "Secondary Trade Volume", value: 0 },
        ].map(({ title, value }) => (
          <li className="basis-1/3" key={title + " " + value}>
            <Card className="py-2 px-3 md:px-4 shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgb(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
              <p className="label-sm">{title}</p>
              <p className="heading-sm">{clampNumber(value)}</p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
};
