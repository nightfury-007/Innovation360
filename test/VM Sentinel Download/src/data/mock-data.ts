import type { Vm, Bot, VmStatus } from '@/types/vm';

export const initialVms: Vm[] = [
  {
    id: 'vm-001',
    name: 'Ubuntu Server 22.04 LTS',
    processId: 'PID-10234',
    botId: 'bot-001',
    status: 'Assigned',
    cpuCores: 4,
    memoryGB: 8,
    storageGB: 100,
    networkBandwidthMbps: 1000,
  },
  {
    id: 'vm-002',
    name: 'Windows Server 2019',
    processId: 'PID-10567',
    botId: null,
    status: 'Free',
    cpuCores: 2,
    memoryGB: 4,
    storageGB: 50,
    networkBandwidthMbps: 500,
  },
  {
    id: 'vm-003',
    name: 'CentOS Stream 9',
    processId: 'PID-10789',
    botId: 'bot-003',
    status: 'Assigned',
    cpuCores: 8,
    memoryGB: 16,
    storageGB: 250,
    networkBandwidthMbps: 1000,
  },
  {
    id: 'vm-004',
    name: 'Debian 11 Bullseye',
    processId: 'PID-10912',
    botId: null,
    status: 'Free',
    cpuCores: 4,
    memoryGB: 8,
    storageGB: 120,
    networkBandwidthMbps: 750,
  },
  {
    id: 'vm-005',
    name: 'Fedora Server 38',
    processId: 'PID-11023',
    botId: null,
    status: 'Free',
    cpuCores: 1,
    memoryGB: 2,
    storageGB: 30,
    networkBandwidthMbps: 250,
  },
];

export const candidateBots: Bot[] = [
  { id: 'bot-001', name: 'ScraperBot-A' },
  { id: 'bot-002', name: 'AnalyzerBot-B' },
  { id: 'bot-003', name: 'ReporterBot-C' },
  { id: 'bot-004', name: 'DataEntryBot-D' },
  { id: 'bot-005', name: 'HeavyLifter-E' },
];

export const vmStatuses: VmStatus[] = ["Free", "Assigned"];
