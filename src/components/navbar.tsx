"use client";

import { Button } from "@/components/ui/button";
import { Clock, Download, HelpCircle, Play, RotateCcw, SkipForward } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";

const Navbar = () => (
  <div className="border-b">
    <div className="flex h-14 items-center justify-between px-4">
      {/* Left side - Logo and Heading */}
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 " />
        <h1 className="text-xl font-bold">Interactive Scheduling Simulator</h1>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Button size="icon">
              <Play />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="outline" size="icon">
              <RotateCcw />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="outline" size="icon">
              <SkipForward />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="outline" size="icon">
              <Download />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="outline" size="icon">
              <HelpCircle />
            </Button>
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
