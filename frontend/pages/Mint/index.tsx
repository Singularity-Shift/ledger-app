import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";

import { HeroSection } from "@/pages/Mint/components/HeroSection";
import { StatsSection } from "@/pages/Mint/components/StatsSection";
import { OurStorySection } from "@/pages/Mint/components/OurStorySection";
import { HowToMintSection } from "@/pages/Mint/components/HowToMintSection";
import { OurTeamSection } from "@/pages/Mint/components/OurTeamSection";
import { FAQSection } from "@/pages/Mint/components/FAQSection";
import { Socials } from "@/pages/Mint/components/Socials";
import { ConnectWalletAlert } from "@/pages/Mint/components/ConnectWalletAlert";

import { useGetCollectionData } from "@/hooks/useGetCollectionData";

import { Header } from "@/components/Header";

export function Mint() {
  const { data, isLoading } = useGetCollectionData();

  const queryClient = useQueryClient();
  const { account } = useWallet();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  if (isLoading) {
    return (
      <div className="text-center p-8 bg-white bg-opacity-90 rounded-lg">
        <h1 className="title-md">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="overflow-hidden">
        <main className="flex flex-col gap-10 md:gap-16 mt-6">
          <ConnectWalletAlert />
          <HeroSection />
          <StatsSection />
          <OurStorySection />
          <HowToMintSection />
          <OurTeamSection />
          <FAQSection />
        </main>

        <footer className="footer-container px-4 pb-6 w-full max-w-screen-xl mx-auto mt-6 md:mt-16 flex items-center justify-between bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg border-2 border-black shadow-lg">
          <p>{data?.collection.collection_name}</p>
          <Socials />
        </footer>
      </div>
    </div>
  );
}
