import { Link, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { Button } from "./ui/button";
import { useAppManagement } from "@/contexts/AppManagement";
import { MessageCircle, ShoppingBag, User } from "lucide-react";
import { TokenBalance } from "@/pages/Mint/components/TokenBalance";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function Header() {
  const location = useLocation();
  const { isAdmin } = useAppManagement();
  const isAdminPage = location.pathname === "/admin";
  const { connected } = useWallet();

  return (
    <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap bg-white bg-opacity-90 backdrop-blur-sm rounded-lg mb-4 border-2 border-black shadow-lg">
      <div className="flex items-center gap-4">
        <h1 className="display">
          <Link to="/">Ledger App Fun 📒</Link>
        </h1>
        <Button variant="outline" asChild size="icon" className="md:hidden">
          <a href={import.meta.env.VITE_CHAT_PAGE} aria-label="Back to SShift GPT">
            <MessageCircle className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" asChild className="hidden md:flex">
          <a href={import.meta.env.VITE_CHAT_PAGE}>Back to SShift GPT</a>
        </Button>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <Button variant="outline" asChild>
          <Link to="/pages-listed" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Page Listed</span>
          </Link>
        </Button>

        {connected && (
          <Button variant="outline" asChild>
            <Link to="/my-pages" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">My Pages</span>
            </Link>
          </Button>
        )}

        <TokenBalance />
        {isAdmin && (
          <Button variant="outline" asChild>
            <Link to={isAdminPage ? "/" : "/admin"}>{isAdminPage ? "Mint" : "Admin"}</Link>
          </Button>
        )}
        <WalletSelector />
      </div>
    </div>
  );
}
