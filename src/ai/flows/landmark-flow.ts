
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
  prompt: `You are a world travel expert. Given the landmark "{{landmarkName}}", your task is to generate exactly 3 new, short, and interesting facts about it. The facts should be verifiable and different from common knowledge.`,
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
