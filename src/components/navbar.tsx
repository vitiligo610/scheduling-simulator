import { Cpu } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import SimulationControls from "@/components/simulation-controls";
import AboutDialog from "@/components/about-dialog";
import React from "react";

const Navbar = () => (
  <div className="border-b">
    <div className="flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Cpu className="h-5 w-5 " />
        <h1 className="text-xl font-bold">Orchestrator</h1>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <SimulationControls />
          <NavigationMenuItem>
            <AboutDialog />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ModeToggle />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </div>
);

export default Navbar;
