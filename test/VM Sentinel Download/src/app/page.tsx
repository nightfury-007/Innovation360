
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Vm, VmStatus, Bot } from '@/types/vm';
import { initialVms, candidateBots } from '@/data/mock-data';
import { AppHeader } from '@/components/vm-sentinel/AppHeader';
import { VmFilters } from '@/components/vm-sentinel/VmFilters';
import { VmTable } from '@/components/vm-sentinel/VmTable';
import { AiBotAssignmentDialog } from '@/components/vm-sentinel/AiBotAssignmentDialog';
import { ConfirmDeleteDialog } from '@/components/vm-sentinel/ConfirmDeleteDialog';
import { VmDetailsDialog } from '@/components/vm-sentinel/VmDetailsDialog';
import { EditVmDialog, type VmFormData } from '@/components/vm-sentinel/EditVmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, LayoutGrid, Cog } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { useToast } from '@/hooks/use-toast';


export default function VmSentinelPage() {
  const [vms, setVms] = useState<Vm[]>(() => JSON.parse(JSON.stringify(initialVms))); // Deep copy
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<VmStatus | 'All'>('All');
  
  // AI Assignment Dialog State
  const [selectedVmForAssignment, setSelectedVmForAssignment] = useState<Vm | null>(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);

  // View Details Dialog State
  const [vmToView, setVmToView] = useState<Vm | null>(null);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);

  // Edit VM Dialog State
  const [vmToEdit, setVmToEdit] = useState<Vm | null>(null);
  const [isEditVmDialogOpen, setIsEditVmDialogOpen] = useState(false);

  // Delete VM Dialog State
  const [vmToDeleteId, setVmToDeleteId] = useState<string | null>(null);
  const [vmToDeleteName, setVmToDeleteName] = useState<string | undefined>(undefined);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const filteredVms = useMemo(() => {
    return vms.filter((vm) => {
      const nameMatch = vm.name.toLowerCase().includes(nameFilter.toLowerCase());
      const statusMatch = statusFilter === 'All' || vm.status === statusFilter;
      return nameMatch && statusMatch;
    });
  }, [vms, nameFilter, statusFilter]);

  // AI Assignment Dialog Handlers
  const handleOpenAiAssignmentDialog = (vm: Vm) => {
    setSelectedVmForAssignment(vm);
    setIsAssignmentDialogOpen(true);
  };

  const handleCloseAiAssignmentDialog = () => {
    setSelectedVmForAssignment(null);
    setIsAssignmentDialogOpen(false);
  };

  const handleAssignBot = (vmId: string, botId: string) => {
    setVms((prevVms) =>
      prevVms.map((vm) =>
        vm.id === vmId ? { ...vm, botId: botId, status: 'Assigned' } : vm
      )
    );
    toast({
      title: "Bot Assigned",
      description: `Bot ${botId} assigned to VM (ID: ${vmId}).`,
      className: "bg-primary text-primary-foreground",
    });
  };

  // View Details Handlers
  const handleViewDetails = (vm: Vm) => {
    setVmToView(vm);
    setIsViewDetailsDialogOpen(true);
  };

  // Edit VM Handlers
  const handleEditVm = (vm: Vm) => {
    setVmToEdit(vm);
    setIsEditVmDialogOpen(true);
  };

  const handleSaveVm = (vmId: string, updatedData: VmFormData) => {
    setVms(prevVms => 
      prevVms.map(vm => 
        vm.id === vmId ? { 
          ...vm, 
          ...updatedData,
          botId: updatedData.botId || null, 
          status: updatedData.botId ? 'Assigned' : 'Free',
        } : vm
      )
    );
    // Toast is handled within EditVmDialog upon successful save
  };

  // Delete VM Handlers
  const handleDeleteVm = (vmId: string) => {
    const vm = vms.find(v => v.id === vmId);
    setVmToDeleteId(vmId);
    setVmToDeleteName(vm?.name);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (vmToDeleteId) {
      const deletedVmName = vms.find(vm => vm.id === vmToDeleteId)?.name || "Unknown VM";
      setVms(prevVms => prevVms.filter(vm => vm.id !== vmToDeleteId));
      toast({
        title: "VM Deleted",
        description: `VM "${deletedVmName}" (ID: ${vmToDeleteId}) has been deleted.`,
        variant: "destructive",
      });
      setIsConfirmDeleteDialogOpen(false);
      setVmToDeleteId(null);
      setVmToDeleteName(undefined);
    }
  };
  
  const vmStats = useMemo(() => {
    const total = vms.length;
    const free = vms.filter(vm => vm.status === 'Free').length;
    const assigned = vms.filter(vm => vm.status === 'Assigned').length;
    return [
      { status: 'Total VMs', count: total, fill: 'var(--color-total)'},
      { status: 'Free VMs', count: free, fill: 'var(--color-free)' },
      { status: 'Assigned VMs', count: assigned, fill: 'var(--color-assigned)' },
    ];
  }, [vms]);

  const chartConfig = {
    total: { label: "Total", color: "hsl(var(--chart-1))" },
    free: { label: "Free", color: "hsl(var(--chart-2))" },
    assigned: { label: "Assigned", color: "hsl(var(--chart-3))" },
    count: { label: "Count" }
  } satisfies ChartConfig


  // Ensure chart is only rendered on client after hydration
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])


  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1 h-full shadow-lg border-border rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                VM Status Overview
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Current distribution of VM statuses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isClient && (
                 <ChartContainer config={chartConfig} className="w-full h-[200px]">
                    <RechartsBarChart accessibilityLayer data={vmStats} layout="vertical" margin={{left: 10, right: 10}}>
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="count" hide/>
                      <YAxis 
                        dataKey="status" 
                        type="category" 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={10}
                        width={100}
                        />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="count" radius={5} />
                    </RechartsBarChart>
                  </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-lg border-border rounded-lg">
            <CardHeader>
               <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <LayoutGrid className="mr-2 h-5 w-5" />
                VM Management
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Filter and manage your virtual machines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VmFilters
                nameFilter={nameFilter}
                setNameFilter={setNameFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
               <div className="mt-4">
                <Button 
                  onClick={() => router.push('/process-config')} 
                  variant="outline" 
                  className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
                >
                  <Cog className="mr-2 h-4 w-4" />
                  Configure VMs by Process
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <VmTable
          vms={filteredVms}
          onOpenAiAssignmentDialog={handleOpenAiAssignmentDialog}
          onViewDetails={handleViewDetails}
          onEditVm={handleEditVm}
          onDeleteVm={handleDeleteVm}
        />
      </main>
      
      {/* AI Assignment Dialog */}
      <AiBotAssignmentDialog
        vm={selectedVmForAssignment}
        candidateBots={candidateBots}
        isOpen={isAssignmentDialogOpen}
        onClose={handleCloseAiAssignmentDialog}
        onAssignBot={handleAssignBot}
      />

      {/* View Details Dialog */}
      <VmDetailsDialog
        vm={vmToView}
        isOpen={isViewDetailsDialogOpen}
        onClose={() => setIsViewDetailsDialogOpen(false)}
      />

      {/* Edit VM Dialog */}
      <EditVmDialog
        vm={vmToEdit}
        candidateBots={candidateBots}
        isOpen={isEditVmDialogOpen}
        onClose={() => setIsEditVmDialogOpen(false)}
        onSave={handleSaveVm}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        vmName={vmToDeleteName}
      />

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border mt-auto">
        © {new Date().getFullYear()} VM Sentinel. All rights reserved.
      </footer>
    </div>
  );
}

