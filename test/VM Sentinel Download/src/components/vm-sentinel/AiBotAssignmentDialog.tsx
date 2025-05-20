"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, Wand2 } from 'lucide-react';
import type { Vm, Bot } from '@/types/vm';
import { suggestBotAssignment, type SuggestBotAssignmentInput, type SuggestBotAssignmentOutput } from '@/ai/flows/suggest-bot-assignment';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AiBotAssignmentDialogProps {
  vm: Vm | null;
  candidateBots: Bot[];
  isOpen: boolean;
  onClose: () => void;
  onAssignBot: (vmId: string, botId: string) => void;
}

export function AiBotAssignmentDialog({
  vm,
  candidateBots,
  isOpen,
  onClose,
  onAssignBot,
}: AiBotAssignmentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestBotAssignmentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Reset state when dialog opens
      setSuggestion(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!vm) return null;

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    const input: SuggestBotAssignmentInput = {
      vmName: vm.name,
      cpuCores: vm.cpuCores,
      memoryGB: vm.memoryGB,
      storageGB: vm.storageGB,
      networkBandwidthMbps: vm.networkBandwidthMbps,
      currentBotId: vm.botId || undefined,
      candidateBotIds: candidateBots.map(bot => bot.id),
    };

    try {
      const result = await suggestBotAssignment(input);
      setSuggestion(result);
    } catch (e) {
      console.error("AI suggestion failed:", e);
      setError("Failed to get AI suggestion. Please try again.");
      toast({
        title: "Error",
        description: "Could not fetch AI bot assignment suggestion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignSuggestedBot = () => {
    if (suggestion?.suggestedBotId) {
      onAssignBot(vm.id, suggestion.suggestedBotId);
      toast({
        title: "Bot Assigned",
        description: `Bot ${suggestion.suggestedBotId} assigned to VM ${vm.name}.`,
        className: "bg-primary text-primary-foreground",
      });
      onClose();
    }
  };
  
  const suggestedBotDetails = candidateBots.find(b => b.id === suggestion?.suggestedBotId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center">
            <Wand2 className="mr-2 h-6 w-6" />
            AI Bot Assignment for {vm.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Get an AI-powered suggestion for assigning a bot to this VM based on its resources.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3">
          <h4 className="font-medium text-foreground">VM Details:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
            <li>CPU Cores: <span className="font-mono text-foreground">{vm.cpuCores}</span></li>
            <li>Memory: <span className="font-mono text-foreground">{vm.memoryGB} GB</span></li>
            <li>Storage: <span className="font-mono text-foreground">{vm.storageGB} GB</span></li>
            <li>Network: <span className="font-mono text-foreground">{vm.networkBandwidthMbps} Mbps</span></li>
          </ul>
        </div>
        
        <Button
            onClick={handleGetSuggestion}
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Get AI Suggestion
          </Button>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestion && (
          <Card className="mt-6 bg-background shadow-md border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                AI Suggestion Received
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground">
                Suggested Bot: <strong className="font-mono text-accent-foreground">{suggestedBotDetails?.name || suggestion.suggestedBotId}</strong> 
                {suggestedBotDetails && <span className="text-muted-foreground font-mono"> ({suggestion.suggestedBotId})</span>}
              </p>
              <div>
                <p className="text-sm font-medium text-foreground">Reasoning:</p>
                <p className="text-sm text-muted-foreground italic p-2 border-l-2 border-accent rounded-r-md bg-secondary/30">
                  {suggestion.reason}
                </p>
              </div>
              <Button
                onClick={handleAssignSuggestedBot}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
              >
                Assign This Bot
              </Button>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="text-muted-foreground border-muted-foreground/50 hover:bg-muted hover:text-muted-foreground/80">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
