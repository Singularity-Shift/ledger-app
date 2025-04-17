import { Link, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { Button } from "./ui/button";
import { useAppManagement } from "@/contexts/AppManagement";
import { Menu, MessageCircle, ShoppingBag, User, X } from "lucide-react";
import { TokenBalance } from "@/pages/Mint/components/TokenBalance";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const { isAdmin } = useAppManagement();
  const { connected } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <Button
      variant={isActive(to) ? "default" : "outline"}
      asChild
      className={cn(
        isActive(to) ? "bg-primary text-primary-foreground" : "hover:bg-accent transition-colors duration-200",
        className,
      )}
    >
      <Link to={to}>{children}</Link>
    </Button>
  );

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="sticky top-0 z-50 w-full px-4 py-2 mb-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto w-full flex-wrap bg-white bg-opacity-90 backdrop-blur-sm rounded-lg border-2 border-black shadow-lg p-3">
        {/* Logo and Back Button */}
        <div className="flex items-center gap-4">
          <h1 className="display text-xl font-bold">
            <Link to="/" className="hover:opacity-80 transition-opacity duration-200">
              Ledger App Fun 📒
            </Link>
          </h1>
          <Button variant="outline" asChild size="icon" className="md:hidden">
            <a href={import.meta.env.VITE_CHAT_PAGE} aria-label="Back to SShift GPT">
              <MessageCircle className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="outline" asChild className="hidden md:flex">
            <a href={import.meta.env.VITE_CHAT_PAGE} className="hover:bg-accent transition-colors duration-200">
              Back to SShift GPT
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 items-center">
          <NavLink to="/pages-listed">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Pages Listed
          </NavLink>

          {connected && (
            <NavLink to="/my-pages">
              <User className="h-4 w-4 mr-2" />
              My Pages
            </NavLink>
          )}

          <TokenBalance />

          {isAdmin && (
            <NavLink to={isActive("/admin") ? "/" : "/admin"}>{isActive("/admin") ? "Mint" : "Admin"}</NavLink>
          )}

          <WalletSelector />
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="w-full md:hidden mt-3 flex flex-col gap-2 border-t pt-3 border-gray-200">
            <NavLink to="/pages-listed" className="w-full justify-start">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Pages Listed
            </NavLink>

            {connected && (
              <NavLink to="/my-pages" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                My Pages
              </NavLink>
            )}

            <div className="py-2">
              <TokenBalance />
            </div>

            {isAdmin && (
              <NavLink to={isActive("/admin") ? "/" : "/admin"} className="w-full justify-start">
                {isActive("/admin") ? "Mint" : "Admin"}
              </NavLink>
            )}

            <div className="py-2">
              <WalletSelector />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
