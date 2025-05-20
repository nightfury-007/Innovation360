// This is an AI-powered tool to suggest optimal bot assignments for free VMs.
// It takes VM resource requirements as input and suggests a suitable bot.
// The file exports the SuggestBotAssignmentInput and SuggestBotAssignmentOutput interfaces, and the suggestBotAssignment function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBotAssignmentInputSchema = z.object({
  vmName: z.string().describe('The name of the virtual machine.'),
  cpuCores: z.number().describe('The number of CPU cores available on the VM.'),
  memoryGB: z.number().describe('The amount of memory (in GB) available on the VM.'),
  storageGB: z.number().describe('The amount of storage (in GB) available on the VM.'),
  networkBandwidthMbps: z.number().describe('The network bandwidth (in Mbps) available to the VM.'),
  currentBotId: z.string().optional().describe('The current bot ID assigned to the VM, if any.'),
  candidateBotIds: z.array(z.string()).describe('The list of bot IDs to consider for assignment to this VM.'),
});
export type SuggestBotAssignmentInput = z.infer<typeof SuggestBotAssignmentInputSchema>;

const SuggestBotAssignmentOutputSchema = z.object({
  suggestedBotId: z.string().describe('The ID of the suggested bot for the VM.'),
  reason: z.string().describe('The reasoning behind the bot assignment suggestion.'),
});
export type SuggestBotAssignmentOutput = z.infer<typeof SuggestBotAssignmentOutputSchema>;

export async function suggestBotAssignment(input: SuggestBotAssignmentInput): Promise<SuggestBotAssignmentOutput> {
  return suggestBotAssignmentFlow(input);
}

const suggestBotAssignmentPrompt = ai.definePrompt({
  name: 'suggestBotAssignmentPrompt',
  input: {schema: SuggestBotAssignmentInputSchema},
  output: {schema: SuggestBotAssignmentOutputSchema},
  prompt: `You are an expert in virtual machine and bot resource management. Given the resource requirements of a VM and a list of available bots, you will suggest the most suitable bot to assign to the VM.

  VM Name: {{{vmName}}}
  VM CPU Cores: {{{cpuCores}}}
  VM Memory (GB): {{{memoryGB}}}
  VM Storage (GB): {{{storageGB}}}
  VM Network Bandwidth (Mbps): {{{networkBandwidthMbps}}}
  Current Bot ID (if any): {{{currentBotId}}}
  Candidate Bot IDs: {{#each candidateBotIds}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Based on the above information, select the best bot from the Candidate Bot IDs to assign to this VM. Explain your reasoning for the selection.
  If no bot seems suitable, pick the bot that is closest and explain why it is the best choice even if it is not ideal.
  Respond with a JSON object that has "suggestedBotId" and "reason" fields.
  Make sure suggestedBotId is a valid bot from Candidate Bot IDs.
  `,
});

const suggestBotAssignmentFlow = ai.defineFlow(
  {
    name: 'suggestBotAssignmentFlow',
    inputSchema: SuggestBotAssignmentInputSchema,
    outputSchema: SuggestBotAssignmentOutputSchema,
  },
  async input => {
    const {output} = await suggestBotAssignmentPrompt(input);
    return output!;
  }
);
