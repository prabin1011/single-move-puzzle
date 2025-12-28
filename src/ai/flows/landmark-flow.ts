'use server';
/**
 * @fileOverview A flow for enhancing landmark data with AI.
 *
 * - landmarkEnhancerFlow - A function that takes a landmark name and returns a new image URL and a list of facts.
 * - LandmarkEnhancerInput - The input type for the flow.
 * - LandmarkEnhancerOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LandmarkEnhancerInputSchema = z.object({
  landmarkName: z.string().describe('The name of the landmark to get data for.'),
});
export type LandmarkEnhancerInput = z.infer<typeof LandmarkEnhancerInputSchema>;

const LandmarkEnhancerOutputSchema = z.object({
  imageUrl: z.string().url().describe('A new, high-quality image URL for the landmark from Unsplash.'),
  facts: z.array(z.string()).describe('An array of 3 short, interesting, and verifiable facts about the landmark.'),
});
export type LandmarkEnhancerOutput = z.infer<typeof LandmarkEnhancerOutputSchema>;

const findImageTool = ai.defineTool(
    {
      name: 'findImage',
      description: 'Finds a suitable image for a given landmark.',
      inputSchema: z.object({
        query: z.string().describe('The search query for the image, usually the landmark name and country.'),
      }),
      outputSchema: z.object({
        imageUrl: z.string().url().describe('The direct URL to the image.'),
      }),
    },
    async (input) => {
        // In a real app, this would call an image search API like Unsplash.
        // For this demo, we'll construct a plausible Unsplash URL.
        const formattedQuery = input.query.toLowerCase().replace(/\s+/g, '-');
        const randomId = Math.random().toString(36).substring(7);
        // This is a placeholder. A real implementation would use the Unsplash API.
        // We'll use a fixed image for predictability in this context.
        return { imageUrl: `https://source.unsplash.com/1200x1200/?${formattedQuery}` };
    }
);


const prompt = ai.definePrompt({
  name: 'landmarkPrompt',
  input: { schema: LandmarkEnhancerInputSchema },
  output: { schema: LandmarkEnhancerOutputSchema },
  tools: [findImageTool],
  prompt: `You are a world travel expert. Given the landmark "{{landmarkName}}", your tasks are:
  1. Use the findImage tool to get a new image URL for this landmark. The query should be the landmark name.
  2. Generate exactly 3 new, short, and interesting facts about it. The facts should be verifiable and different from common knowledge.
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
    // Use the image URL returned by the tool
    return {
        imageUrl: output.imageUrl,
        facts: output.facts,
    }
  }
);
