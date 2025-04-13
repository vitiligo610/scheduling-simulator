"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

const AboutDialog = () => (
  <Dialog>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <HelpCircle />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>About</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
            <li>Capt. Haroon Ishaq</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default AboutDialog;