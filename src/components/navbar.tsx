import { Cpu } from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import AboutDialog from "@/components/about-dialog";

const navLinks = [
  { href: "/", label: "Home" },
];

const Navbar = () => (
  <header className="px-10 border-b">
    <div className="container flex h-14 items-center">
      <div className="mr-4 flex">
        <Link href="/" className="flex items-center space-x-2">
          <Cpu className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden md:inline-block text-primary">Orchestrator</span>
        </Link>
      </div>
      <NavigationMenu className="ml-auto">
        <NavigationMenuList>
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent text-primary hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <AboutDialog />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </header>
);

export default Navbar;