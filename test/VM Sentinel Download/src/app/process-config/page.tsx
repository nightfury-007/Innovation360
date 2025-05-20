
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Vm, Bot, VmStatus } from '@/types/vm';
import { initialVms, candidateBots } from '@/data/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppHeader } from '@/components/vm-sentinel/AppHeader';
import { AddVmDialog, type AddVmFormData } from '@/components/vm-sentinel/AddVmDialog';
import { ConfirmDeleteDialog } from '@/components/vm-sentinel/ConfirmDeleteDialog';
import { ArrowLeft, Save, Cog, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NO_BOT_VALUE = "--NONE--";

// Helper to generate a somewhat unique ID for new VMs
const generateVmId = () => `vm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

export default function ConfigureProcessVmsPage() {
  const [allVms, setAllVms] = useState<Vm[]>(() => JSON.parse(JSON.stringify(initialVms))); 
  const [selectedProcessId, setSelectedProcessId] = useState<string>('');
  const [processVms, setProcessVms] = useState<Vm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempBotAssignments, setTempBotAssignments] = useState<Record<string, string | null>>({});

  // State for AddVmDialog
  const [isAddVmDialogOpen, setIsAddVmDialogOpen] = useState(false);

  // State for ConfirmDeleteDialog
  const [vmToDelete, setVmToDelete] = useState<Vm | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const uniqueProcessIds = useMemo(() => {
    const ids = new Set(allVms.map(vm => vm.processId).filter(pid => pid)); // Filter out empty process IDs
    return Array.from(ids);
  }, [allVms]);

  useEffect(() => {
    if (selectedProcessId) {
      const filtered = allVms.filter(vm => vm.processId === selectedProcessId);
      setProcessVms(filtered);
      
      const initialAssignments: Record<string, string | null> = {};
      filtered.forEach(vm => {
        initialAssignments[vm.id] = vm.botId;
      });
      setTempBotAssignments(initialAssignments);

    } else {
      setProcessVms([]);
      setTempBotAssignments({});
    }
  }, [selectedProcessId, allVms]);

  const handleProcessIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProcessId(event.target.value);
  };

  const handleBotAssignmentChange = (vmId: string, newBotId: string | null) => {
    setTempBotAssignments(prev => ({
      ...prev,
      [vmId]: newBotId === NO_BOT_VALUE ? null : newBotId,
    }));
  };

  const handleSaveChanges = () => {
    if (!selectedProcessId) return;
    setIsLoading(true);

    const updatedVmsMasterList = allVms.map(vm => {
      if (vm.processId === selectedProcessId && tempBotAssignments.hasOwnProperty(vm.id)) {
        const newBotId = tempBotAssignments[vm.id];
        return {
          ...vm,
          botId: newBotId,
          status: newBotId ? 'Assigned' : 'Free',
        } as Vm;
      }
      return vm;
    });

    setAllVms(updatedVmsMasterList);

    toast({
      title: "Configuration Saved",
      description: `Bot assignments for process ${selectedProcessId} have been updated.`,
      className: "bg-primary text-primary-foreground",
    });
    setIsLoading(false);
    
     const currentAssignmentsForProcess: Record<string, string | null> = {};
     updatedVmsMasterList.filter(vm => vm.processId === selectedProcessId).forEach(vm => {
        currentAssignmentsForProcess[vm.id] = vm.botId;
     });
     setTempBotAssignments(currentAssignmentsForProcess);
  };

  // Add VM Handlers
  const handleOpenAddVmDialog = () => {
    if (!selectedProcessId) {
        toast({ title: "Select Process ID", description: "Please select or enter a Process ID first.", variant: "destructive"});
        return;
    }
    setIsAddVmDialogOpen(true);
  }

  const handleAddNewVm = (formData: AddVmFormData) => {
    const newVm: Vm = {
      id: generateVmId(),
      processId: selectedProcessId, // Already ensured selectedProcessId is not empty
      name: formData.name,
      botId: formData.botId || null,
      status: formData.botId ? 'Assigned' : 'Free',
      cpuCores: formData.cpuCores,
      memoryGB: formData.memoryGB,
      storageGB: formData.storageGB,
      networkBandwidthMbps: formData.networkBandwidthMbps,
    };
    setAllVms(prev => [...prev, newVm]);
    toast({
        title: "VM Added",
        description: `VM "${newVm.name}" added to process ${selectedProcessId}.`,
    });
  };

  // Delete VM Handlers
  const handleOpenDeleteDialog = (vm: Vm) => {
    setVmToDelete(vm);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteVm = () => {
    if (vmToDelete) {
      setAllVms(prev => prev.filter(v => v.id !== vmToDelete.id));
      toast({
        title: "VM Removed",
        description: `VM "${vmToDelete.name}" has been removed.`,
        variant: "destructive",
      });
      setVmToDelete(null);
      setIsConfirmDeleteOpen(false);
    }
  };
  
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])


  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push('/')} className="mb-4 text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to VM Dashboard
          </Button>
          <Card className="shadow-lg border-border rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <Cog className="mr-2 h-5 w-5" />
                Configure VMs by Process
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Select a Process ID to view and configure its associated Virtual Machines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="process-id-input" className="block text-sm font-medium mb-1">Process ID</Label>
                <Input
                  id="process-id-input"
                  type="text"
                  placeholder="Enter or select Process ID (e.g., PID-10234)"
                  value={selectedProcessId}
                  onChange={handleProcessIdChange}
                  list="process-ids-datalist"
                  className="max-w-sm bg-background border-input rounded-md shadow-sm"
                />
                <datalist id="process-ids-datalist">
                  {uniqueProcessIds.map(pid => (
                    <option key={pid} value={pid} />
                  ))}
                </datalist>
              </div>
              {selectedProcessId && (
                <Button onClick={handleOpenAddVmDialog} variant="outline" className="mt-2 border-primary text-primary hover:bg-primary/10">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New VM to Process {selectedProcessId}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedProcessId && processVms.length > 0 && isClient && (
          <Card className="shadow-lg border-border rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">VMs for Process: <span className="font-mono text-accent">{selectedProcessId}</span></CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Manage bot assignments and VMs for the process listed below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>VM Name</TableHead>
                      <TableHead>VM ID</TableHead>
                      <TableHead className="w-[250px]">Assign Bot</TableHead>
                      <TableHead className="w-[100px] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processVms.map((vm) => (
                      <TableRow key={vm.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-foreground py-3">{vm.name}</TableCell>
                        <TableCell className="font-mono text-muted-foreground py-3">{vm.id}</TableCell>
                        <TableCell className="py-2">
                          <Select
                            value={tempBotAssignments[vm.id] ?? NO_BOT_VALUE}
                            onValueChange={(newBotId) => handleBotAssignmentChange(vm.id, newBotId)}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="bg-background border-input rounded-md shadow-sm">
                              <SelectValue placeholder="Select a bot" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={NO_BOT_VALUE}>No Bot Assigned</SelectItem>
                              {candidateBots.map((bot) => (
                                <SelectItem key={bot.id} value={bot.id}>
                                  {bot.name} ({bot.id})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center py-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(vm)} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove VM</span>
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 flex justify-end">
                <Button 
                    onClick={handleSaveChanges} 
                    disabled={isLoading || Object.keys(tempBotAssignments).length === 0} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Bot Assignments for Process {selectedProcessId}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedProcessId && processVms.length === 0 && isClient && (
          <Card className="shadow-lg border-border rounded-lg">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center py-4">No VMs found for Process ID: <span className="font-mono text-accent">{selectedProcessId}</span>. You can add VMs to this process.</p>
            </CardContent>
          </Card>
        )}
         {!selectedProcessId && isClient && (
          <Card className="shadow-lg border-border rounded-lg">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center py-4">Please enter or select a Process ID to see and manage associated VMs.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Add VM Dialog */}
      {selectedProcessId && (
        <AddVmDialog
            isOpen={isAddVmDialogOpen}
            onClose={() => setIsAddVmDialogOpen(false)}
            onSave={handleAddNewVm}
            processId={selectedProcessId}
            candidateBots={candidateBots}
        />
      )}

      {/* Confirm Delete Dialog for removing VM */}
      <ConfirmDeleteDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDeleteVm}
        vmName={vmToDelete?.name}
      />

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} VM Sentinel. All rights reserved.
      </footer>
    </div>
  );
}

