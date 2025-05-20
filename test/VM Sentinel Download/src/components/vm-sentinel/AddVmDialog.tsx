
"use client";

import { useEffect } from 'react';
import type { Bot } from '@/types/vm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NO_BOT_VALUE = "--NONE--";

const addVmSchema = z.object({
  name: z.string().min(1, "Name is required"),
  botId: z.string().nullable().optional(),
  cpuCores: z.coerce.number().int().min(1, "CPU cores must be at least 1"),
  memoryGB: z.coerce.number().int().min(1, "Memory must be at least 1 GB"),
  storageGB: z.coerce.number().int().min(1, "Storage must be at least 1 GB"),
  networkBandwidthMbps: z.coerce.number().int().min(1, "Network bandwidth must be at least 1 Mbps"),
});

export type AddVmFormData = z.infer<typeof addVmSchema>;

interface AddVmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddVmFormData) => void;
  processId: string;
  candidateBots: Bot[];
}

export function AddVmDialog({ isOpen, onClose, onSave, processId, candidateBots }: AddVmDialogProps) {
  const { toast } = useToast();
  const form = useForm<AddVmFormData>({
    resolver: zodResolver(addVmSchema),
    defaultValues: {
      name: '',
      botId: null,
      cpuCores: 1,
      memoryGB: 2,
      storageGB: 20,
      networkBandwidthMbps: 100,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(); // Reset form when dialog opens
    }
  }, [isOpen, form]);

  if (!isOpen) return null;

  const onSubmit = (data: AddVmFormData) => {
    const submittedData = {
      ...data,
      botId: data.botId === NO_BOT_VALUE ? null : data.botId,
    };
    onSave(submittedData);
    toast({
      title: "VM Added",
      description: `VM "${data.name}" has been prepared for process ${processId}.`,
      className: "bg-primary text-primary-foreground",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center">
            <PlusCircle className="mr-2 h-6 w-6" />
            Add New VM to Process {processId}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the details for the new virtual machine.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VM Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New Ubuntu Server" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="botId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Bot (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === NO_BOT_VALUE ? null : value)}
                    value={field.value ?? NO_BOT_VALUE}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="No bot assigned" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_BOT_VALUE}>No Bot Assigned</SelectItem>
                      {candidateBots.map((bot) => (
                        <SelectItem key={bot.id} value={bot.id}>
                          {bot.name} ({bot.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cpuCores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPU Cores</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="memoryGB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memory (GB)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storageGB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage (GB)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="networkBandwidthMbps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network (Mbps)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add VM
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
