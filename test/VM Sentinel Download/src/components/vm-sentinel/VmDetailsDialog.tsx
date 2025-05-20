
"use client";

import type { Vm } from "@/types/vm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Server, Cpu, Zap, HardDrive, Network, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface VmDetailsDialogProps {
  vm: Vm | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VmDetailsDialog({ vm, isOpen, onClose }: VmDetailsDialogProps) {
  if (!vm || !isOpen) return null;

  const detailItemClass = "flex justify-between items-center py-2";
  const labelClass = "text-sm text-muted-foreground flex items-center";
  const valueClass = "text-sm font-medium text-foreground";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center">
            <Info className="mr-2 h-6 w-6" />
            VM Details: {vm.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detailed information for virtual machine <strong className="text-foreground">{vm.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3">
          <div className={detailItemClass}>
            <span className={labelClass}><Server className="mr-2 h-4 w-4" />ID</span>
            <span className={cn(valueClass, "font-mono")}>{vm.id}</span>
          </div>
          <Separator />
          <div className={detailItemClass}>
            <span className={labelClass}><Server className="mr-2 h-4 w-4" />Process ID</span>
            <span className={cn(valueClass, "font-mono")}>{vm.processId}</span>
          </div>
          <Separator />
          <div className={detailItemClass}>
            <span className={labelClass}><Zap className="mr-2 h-4 w-4" />Bot ID</span>
            {vm.botId ? (
              <span className={cn(valueClass, "font-mono")}>{vm.botId}</span>
            ) : (
              <span className="text-sm italic text-muted-foreground/70">N/A</span>
            )}
          </div>
          <Separator />
          <div className={detailItemClass}>
            <span className={labelClass}><Server className="mr-2 h-4 w-4" />Status</span>
            <Badge
              variant={vm.status === 'Assigned' ? 'destructive' : 'default'}
              className={cn(
                vm.status === 'Assigned'
                  ? 'bg-red-500/80 text-white'
                  : 'bg-green-500/80 text-white',
                "capitalize text-xs"
              )}
            >
              {vm.status}
            </Badge>
          </div>
          <Separator />
          <div className={detailItemClass}>
            <span className={labelClass}><Cpu className="mr-2 h-4 w-4" />CPU Cores</span>
            <span className={valueClass}>{vm.cpuCores}</span>
          </div>
          <Separator />
          <div className={detailItemClass}>
            <span className={labelClass}><Server className="mr-2 h-4 w-4" />Memory</span>
            <span className={valueClass}>{vm.memoryGB} GB</span>
          </div>
          <Separator />
          <div className={detailItemClass}>
            <span className={labelClass}><HardDrive className="mr-2 h-4 w-4" />Storage</span>
            <span className={valueClass}>{vm.storageGB} GB</span>
          </div>
          <Separator />
          <div className={detailItemClass}>
            <span className={labelClass}><Network className="mr-2 h-4 w-4" />Network Bandwidth</span>
            <span className={valueClass}>{vm.networkBandwidthMbps} Mbps</span>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
