"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addProcess } from "@/lib/features/process/processSlice";
import { ProcessStatus } from "@/lib/definitions";

const createProcessFormSchema = (minArrivalTime: number) =>
  z.object({
    arrivalTime: z.coerce
      .number({ invalid_type_error: "Arrival time must be a number." })
      .min(minArrivalTime, { message: `Arrival time cannot be less than ${minArrivalTime}.` })
      .int({ message: "Arrival time must be an integer." }),
    burstTime: z.coerce
      .number({ invalid_type_error: "Burst time must be a number." })
      .min(1, { message: "Burst time must be at least 1." })
      .int({ message: "Burst time must be an integer." }),
    priority: z.coerce
      .number({ invalid_type_error: "Priority must be a number." })
      .min(1, { message: "Priority must be at least 1." })
      .int({ message: "Priority must be an integer." }),
  });

const ProcessForm = () => {
  const dispatch = useAppDispatch();
  const scheduler = useAppSelector(state => state.scheduler);
  const processFormSchema = createProcessFormSchema(scheduler.currentTime);
  type ProcessFormValues = z.infer<typeof processFormSchema>;

  // Initialize the form hook
  const form = useForm<ProcessFormValues>({
    resolver: zodResolver(processFormSchema),
    defaultValues: {
      arrivalTime: 0,
      burstTime: 5,
      priority: 1,
    },
  });

  function onSubmit(values: ProcessFormValues) {
    console.log("Form Submitted:", values);

    const newProcessData = {
      id: Date.now(),
      name: `P${Date.now().toString().slice(-4)}`,
      arrivalTime: values.arrivalTime,
      burstTime: values.burstTime,
      priority: values.priority ?? 1,
      remainingTime: values.burstTime,
      startTime: undefined,
      endTime: undefined,
      status: ProcessStatus.READY,
    };

    dispatch(addProcess(newProcessData));
    toast.success("Process added successfully!");
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Keep the original rounded border and padding */}
        <div className="rounded-md border">
          <div className="px-4 py-3 border-b">
            <h3 className="text-md font-medium">Add New Process</h3>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="burstTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-sm">
                      Burst Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        type="number"
                        min="1"
                        placeholder="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-sm">
                      Arrival Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        type="number"
                        min={scheduler.currentTime}
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm">
                    Priority (lower is higher)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type="number"
                      min="1"
                      placeholder="3"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Add Process
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProcessForm;