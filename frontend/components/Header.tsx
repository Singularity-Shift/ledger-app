import { config } from "@/config";
import { useGetCollectionData } from "@/hooks/useGetCollectionData";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";

export function Header() {
  const { data } = useGetCollectionData();

  return (
    <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap bg-white bg-opacity-90 backdrop-blur-sm rounded-lg mb-4 border-2 border-black shadow-lg">
      <h1 className="display">
        <Link to="/">Ledger App Fun 📒</Link>
      </h1>

      <div className="flex gap-2 items-center flex-wrap">
        <WalletSelector />
      </div>
    </div>
  );
}
