
"use client";

import type { Vm } from '@/types/vm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wand2, ServerOff, Server, MoreHorizontal, Eye, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VmTableProps {
  vms: Vm[];
  onOpenAiAssignmentDialog: (vm: Vm) => void;
  onViewDetails: (vm: Vm) => void;
  onEditVm: (vm: Vm) => void;
  onDeleteVm: (vmId: string) => void;
}

export function VmTable({ vms, onOpenAiAssignmentDialog, onViewDetails, onEditVm, onDeleteVm }: VmTableProps) {
  if (vms.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No VMs found matching your criteria.</div>;
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Process ID</TableHead>
            <TableHead>Bot ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px] text-center">AI Assign</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vms.map((vm) => (
            <TableRow
              key={vm.id}
              className={cn(
                "transition-colors duration-300 ease-in-out",
                vm.status === "Free" ? "hover:bg-green-500/10" : "hover:bg-red-500/10"
              )}
            >
              <TableCell className="font-medium text-foreground">{vm.name}</TableCell>
              <TableCell><span className="font-mono text-muted-foreground">{vm.processId}</span></TableCell>
              <TableCell>
                {vm.botId ? (
                  <span className="font-mono text-muted-foreground">{vm.botId}</span>
                ) : (
                  <span className="italic text-muted-foreground/70">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={vm.status === 'Assigned' ? 'destructive' : 'default'}
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    vm.status === 'Assigned'
                      ? 'bg-red-500/80 hover:bg-red-600/80 text-white dark:bg-red-700/80 dark:hover:bg-red-800/80'
                      : 'bg-green-500/80 hover:bg-green-600/80 text-white dark:bg-green-600/80 dark:hover:bg-green-700/80',
                    "capitalize flex items-center gap-1 w-fit px-3 py-1 rounded-full text-xs"
                  )}
                >
                  {vm.status === 'Free' ? <Server className="h-3 w-3" /> : <ServerOff className="h-3 w-3" />}
                  {vm.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {vm.status === 'Free' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenAiAssignmentDialog(vm)}
                    className="border-accent text-accent-foreground hover:bg-accent/10 hover:border-accent/80 transition-colors duration-200"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Assign (AI)
                  </Button>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(vm)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditVm(vm)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteVm(vm.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
