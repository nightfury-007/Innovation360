"use client";

import type { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { VmStatus } from '@/types/vm';
import { vmStatuses } from '@/data/mock-data';
import { Search, Filter } from 'lucide-react';

interface VmFiltersProps {
  nameFilter: string;
  setNameFilter: Dispatch<SetStateAction<string>>;
  statusFilter: VmStatus | 'All';
  setStatusFilter: Dispatch<SetStateAction<VmStatus | 'All'>>;
}

export function VmFilters({
  nameFilter,
  setNameFilter,
  statusFilter,
  setStatusFilter,
}: VmFiltersProps) {
  return (
    <div className="p-4 bg-card rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="name-filter" className="flex items-center mb-1">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            Filter by Name
          </Label>
          <Input
            id="name-filter"
            type="text"
            placeholder="Enter VM name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="bg-background"
          />
        </div>
        <div>
          <Label htmlFor="status-filter" className="flex items-center mb-1">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            Filter by Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as VmStatus | 'All')}
          >
            <SelectTrigger id="status-filter" className="bg-background">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {vmStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
