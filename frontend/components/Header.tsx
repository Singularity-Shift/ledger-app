import { Link, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { Button } from "./ui/button";
import { useAppManagement } from "@/contexts/AppManagement";
import { MessageCircle } from "lucide-react";

export function Header() {
  const location = useLocation();
  const { isAdmin } = useAppManagement();
  const isAdminPage = location.pathname === "/admin";

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
