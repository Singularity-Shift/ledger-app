import { Link, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { Button } from "./ui/button";
<<<<<<< HEAD
import { useAppManagement } from "@/contexts/AppManagement";
=======
import { Settings, Wallet } from "lucide-react";
>>>>>>> main

export function Header() {
  const location = useLocation();
  const { isAdmin } = useAppManagement();
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap bg-white bg-opacity-90 backdrop-blur-sm rounded-lg mb-4 border-2 border-black shadow-lg">
      <h1 className="display">
        <Link to="/">Ledger App Fun 📒</Link>
      </h1>

<<<<<<< HEAD
      <div className="flex gap-2 items-center flex-wrap">
        {isAdmin && (
          <Button variant="outline" asChild>
            <Link to={isAdminPage ? "/" : "/admin"}>{isAdminPage ? "Mint" : "Admin"}</Link>
          </Button>
        )}
=======
      <div className="flex gap-1 sm:gap-2 items-center flex-wrap">
        <Button variant="outline" asChild className="h-8 w-8 p-0 sm:w-auto sm:h-10 sm:px-4">
          <Link to={isAdminPage ? "/" : "/admin"} className="flex items-center justify-center">
            <Settings className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">{isAdminPage ? "Mint" : "Admin"}</span>
          </Link>
        </Button>
>>>>>>> main
        <WalletSelector />
      </div>
    </div>
  );
}
