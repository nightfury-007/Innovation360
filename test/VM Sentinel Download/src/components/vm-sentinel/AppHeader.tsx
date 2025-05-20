import { VmSentinelLogo } from '@/components/icons/VmSentinelLogo';

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center">
        <VmSentinelLogo className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold">VM Sentinel</h1>
      </div>
    </header>
  );
}
