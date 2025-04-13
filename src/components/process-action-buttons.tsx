"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Process } from "@/lib/definitions";
import { removeProcess, updateProcess } from "@/lib/features/process/processSlice";
import { useAppSelector } from "@/lib/hooks";
import { toast } from "sonner";
import { pauseSimulation, startSimulation } from "@/lib/features/scheduler/schedulerSlice";

const formSchema = z.object({
  id: z.coerce.string().optional(),
  burstTime: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .int({ message: "Must be an integer" })
    .positive({ message: "Burst time must be positive" }),
  priority: z.coerce // Use coerce
    .number({ invalid_type_error: "Must be a number" })
    .int({ message: "Must be an integer" })
    .min(1, { message: "Priority cannot be negative" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessActionButtonsProps {
  processId: number;
}

const ProcessActionButtons: React.FC<ProcessActionButtonsProps> = ({ processId }) => {
  const dispatch = useDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const scheduler = useAppSelector(state => state.scheduler);
  const process = useAppSelector(state =>
    state.processes.processes.find(p => p.id === processId),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      burstTime: process?.burstTime || 1,
      priority: process?.priority || 1,
    },
  });

  useEffect(() => {
    if (process && isEditDialogOpen) {
      form.reset({
        burstTime: process.burstTime,
        priority: process.priority,
      });
    }
  }, [process, isEditDialogOpen, form]);


  const onSubmit = (values: FormValues) => {
    if (!process) {
      console.error("Cannot update process: Process not found in store.");
      return;
    }

    const updatedProcessData: Process = {
      ...process,
      id: process.id,
      burstTime: values.burstTime,
      priority: values.priority,
      remainingTime: values.burstTime - (process.burstTime - process.remainingTime),
    };

    console.log("Updating process:", updatedProcessData);
    dispatch(updateProcess(updatedProcessData));
    setIsEditDialogOpen(false);
    dispatch(startSimulation());
    toast.success("Process updated successfully!");
    form.reset();
  };

  const handleDelete = () => {
    if (processId === scheduler.activeProcessId) {
      toast.error("Cannot delete an active process!");
      return;
    }
    console.log("Deleting process:", processId);
    dispatch(removeProcess(processId));
    toast.success("Process removed successfully!");
  };

  if (!process) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button size="icon" variant="outline" onClick={() => dispatch(pauseSimulation())}>
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Process</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Process (ID: P{processId})</DialogTitle>
            <DialogDescription>
              Modify the Burst Time and Priority. Changes might affect ongoing simulations.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Process ID</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="P1" {...field} value={`P${process.id}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="burstTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Burst Time</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={!form.formState.isDirty || !form.formState.isValid}
                        onClick={() => dispatch(pauseSimulation())}>
                  Update Process
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove Process</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove Process: P{processId} from the simulation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProcessActionButtons;