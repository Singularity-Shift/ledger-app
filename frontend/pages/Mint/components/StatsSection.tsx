// Internal components
import { Card } from "@/components/ui/card";
// Internal utils
import { clampNumber } from "@/utils/clampNumber";
// Internal hooks
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
import { useEffect, useState } from "react";
import { aptosClient } from "@/utils/aptosClient";
import { convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk";

interface StatsSectionProps {}

export const StatsSection: React.FC<StatsSectionProps> = () => {
  const { data } = useGetCollectionData();
  const [marketVolume, setMarketVolume] = useState(0);
  const { totalMinted = 0, uniqueHolders = 0 } = data ?? {};
  const aptos = aptosClient();

  useEffect(() => {
    (async () => {
      const result = await aptos.queryIndexer<any>({
        query: {
          query: `query MyQuery {
            account_transactions(
              where: {account_address: {_eq: "0x3212ed354e3d5b17ed6e3f7e8fb3066325b54be80d61d0d5d01dbc23d95f34d5"}}
            ) {
              coin_activities(order_by: {transaction_timestamp: desc}) {
                amount
                activity_type
                coin_type
                owner_address
                transaction_timestamp
                transaction_version
                entry_function_id_str
              }
            }
          }`,
        },
      });

      const amount = result.account_transactions
        .flatMap((t: any) => t.coin_activities)
        .filter(
          (r: any) =>
            r.activity_type === "0x1::coin::WithdrawEvent" &&
            r.entry_function_id_str ===
              "0x7ccf0e6e871977c354c331aa0fccdffb562d9fceb27e3d7f61f8e12e470358e9::aggregator::purchase_many",
        )
        .reduce((acc: number, curr: any) => acc + curr.amount, 0);

      setMarketVolume(convertAmountFromOnChainToHumanReadable(amount, 8));
    })();
  }, []);

  return (
    <section className="stats-container px-3 md:px-4 max-w-screen-xl mx-auto w-full bg-white bg-opacity-90 backdrop-blur-sm p-3 md:p-4 rounded-lg border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
      <ul className="flex flex-col md:flex-row gap-3 md:gap-6">
        {[
          { title: "Collection Size", value: totalMinted },
          { title: "Wallets Participated", value: uniqueHolders },
          { title: "Secondary Trade Volume", value: `${marketVolume} APT` },
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
