
"use client";

import { useEffect } from 'react';
import type { Vm, Bot } from '@/types/vm';
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
import { Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NO_BOT_VALUE = "--NONE--"; // Placeholder for "No Bot Assigned"

const vmSchema = z.object({
  name: z.string().min(1, "Name is required"),
  processId: z.string().min(1, "Process ID is required"),
  botId: z.string().nullable().optional(), // Can be null (no bot) or a string ID
  cpuCores: z.coerce.number().int().min(1, "CPU cores must be at least 1"),
  memoryGB: z.coerce.number().int().min(1, "Memory must be at least 1 GB"),
  storageGB: z.coerce.number().int().min(1, "Storage must be at least 1 GB"),
  networkBandwidthMbps: z.coerce.number().int().min(1, "Network bandwidth must be at least 1 Mbps"),
});

export type VmFormData = z.infer<typeof vmSchema>;

interface EditVmDialogProps {
  vm: Vm | null;
  candidateBots: Bot[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (vmId: string, data: VmFormData) => void;
}

export function EditVmDialog({ vm, candidateBots, isOpen, onClose, onSave }: EditVmDialogProps) {
  const { toast } = useToast();
  const form = useForm<VmFormData>({
    resolver: zodResolver(vmSchema),
    defaultValues: {
      name: '',
      processId: '',
      botId: null,
      cpuCores: 1,
      memoryGB: 1,
      storageGB: 10,
      networkBandwidthMbps: 100,
    },
  });

  useEffect(() => {
    if (vm && isOpen) {
      form.reset({
        name: vm.name,
        processId: vm.processId,
        botId: vm.botId, // react-hook-form handles null here correctly
        cpuCores: vm.cpuCores,
        memoryGB: vm.memoryGB,
        storageGB: vm.storageGB,
        networkBandwidthMbps: vm.networkBandwidthMbps,
      });
    }
  }, [vm, isOpen, form]);

  if (!vm) return null;

  const onSubmit = (data: VmFormData) => {
    const submittedData = {
      ...data,
      // Convert placeholder back to null if it was selected
      botId: data.botId === NO_BOT_VALUE ? null : data.botId,
    };
    onSave(vm.id, submittedData);
    toast({
      title: "VM Updated",
      description: `VM "${data.name}" has been updated successfully.`,
      className: "bg-primary text-primary-foreground",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center">
            <Edit3 className="mr-2 h-6 w-6" />
            Edit VM: {vm.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modify the details of the virtual machine.
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
                    <Input placeholder="e.g., Ubuntu Server" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="processId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Process ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., PID-12345" {...field} />
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
                  <FormLabel>Assigned Bot</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === NO_BOT_VALUE ? null : value)}
                    value={field.value ?? NO_BOT_VALUE} // Map null/undefined from form to NO_BOT_VALUE for Select
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bot to assign" />
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
                      <Input type="number" placeholder="e.g., 4" {...field} />
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
                      <Input type="number" placeholder="e.g., 8" {...field} />
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
                      <Input type="number" placeholder="e.g., 100" {...field} />
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
                      <Input type="number" placeholder="e.g., 1000" {...field} />
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
