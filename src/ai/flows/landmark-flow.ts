
'use server';
/**
 * @fileOverview A flow for enhancing landmark data with AI.
 *
 * - landmarkEnhancerFlow - A function that takes a landmark name and returns a list of facts.
 * - LandmarkEnhancerInput - The input type for the flow.
 * - LandmarkEnhancerOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LandmarkEnhancerInputSchema = z.object({
  landmarkName: z.string().describe('The name of the landmark to get data for.'),
});
export type LandmarkEnhancerInput = z.infer<typeof LandmarkEnhancerInputSchema>;

// The output is now just the facts, as images are pre-curated.
const LandmarkEnhancerOutputSchema = z.object({
  facts: z.array(z.string()).describe('An array of 3 short, interesting, and verifiable facts about the landmark.'),
});
export type LandmarkEnhancerOutput = z.infer<typeof LandmarkEnhancerOutputSchema>;


const prompt = ai.definePrompt({
  name: 'landmarkPrompt',
  input: { schema: LandmarkEnhancerInputSchema },
  output: { schema: LandmarkEnhancerOutputSchema },
  prompt: `
You are a world travel and history expert.

Given the landmark "{{landmarkName}}", generate EXACTLY 3 short but rich facts.
Each fact should:
- be specific and non-obvious,
- be accurate and verifiable,
- be interesting enough that an entire chapter of a book could be written from it.

Avoid generic trivia like "it is very famous" or "many tourists visit it".
Return them as a JSON array of strings.
`,
});

export const landmarkEnhancerFlow = ai.defineFlow(
  {
    name: 'landmarkEnhancerFlow',
    inputSchema: LandmarkEnhancerInputSchema,
    outputSchema: LandmarkEnhancerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return the expected output.");
    }
    return {
        facts: output.facts,
    }
  }
);
