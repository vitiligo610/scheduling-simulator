"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setMlfqConfig } from "@/lib/features/mlfq/mlfqSlice";
import type { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

const formSchema = z.object({
  numQueues: z.coerce.number().int().min(2).max(5),
  baseQuantum: z.coerce.number().int().min(1).max(100),
});

type FormValues = z.infer<typeof formSchema>

export default function MlfqConfigDialog() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const mlfqConfig = useSelector((state: RootState) => state.mlfq);

  const baseQuantum = mlfqConfig.queuesConfig.length > 0 ? mlfqConfig.queuesConfig[0].quantum : 2;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numQueues: mlfqConfig.numQueues,
      baseQuantum: baseQuantum,
    },
  });

  const onSubmit = (data: FormValues) => {
    dispatch(
      setMlfqConfig({
        numQueues: data.numQueues,
        baseQuantum: data.baseQuantum,
      }),
    );

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure MLFQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>MLFQ Configuration</DialogTitle>
          <DialogDescription>
            Set the number of queues and base time quantum. Higher queues (lower index) have higher priority.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="numQueues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Queues</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number.parseInt(value, 10))}
                          defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select number of queues" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select how many priority levels your MLFQ will have.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseQuantum"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Base Quantum</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    he base quantum for the highest priority queue. Lower priority queues will have larger
                    quanta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Configuration</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
