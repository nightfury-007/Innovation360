export type VmStatus = "Free" | "Assigned";

export interface Vm {
  id: string;
  name: string;
  processId: string;
  botId: string | null;
  status: VmStatus;
  cpuCores: number;
  memoryGB: number;
  storageGB: number;
  networkBandwidthMbps: number;
}

export interface Bot {
  id: string;
  name: string;
}
