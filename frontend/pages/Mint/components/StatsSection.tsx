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
    <section className="stats-container px-4 max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg border-2 border-black shadow-lg">
      <ul className="flex flex-col md:flex-row gap-6">
        {[
          { title: "📒 Collection Size", value: totalMinted },
          { title: "Wallets Participated", value: uniqueHolders },
          { title: "Secondary Trade Volume", value: 0 },
        ].map(({ title, value }) => (
          <li className="basis-1/3" key={title + " " + value}>
            <Card className="py-2 px-4" shadow="md">
              <p className="label-sm">{title}</p>
              <p className="heading-sm">{clampNumber(value)}</p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
};
