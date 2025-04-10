"use client";

import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const AboutDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <NavigationMenuLink
        className={cn(
          "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent text-primary hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        )}
      >
        About
      </NavigationMenuLink>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Orchestrator - Process Scheduling Simulator</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p>
          Orchestrator is a web app for simulating process scheduling. Add processes, apply different algorithms, and
          see how they manage tasks.
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">Submitted By:</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Ahmed Javed</li>
            <li>Abdul Rehman</li>
            <li>Mushaf Ali Meesum</li>
            <li>Sibas Ayyub Khan</li>
            <li>Maj. Faiz ul Haq</li>
            <li>Capt. Harron Ishaq</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default AboutDialog;