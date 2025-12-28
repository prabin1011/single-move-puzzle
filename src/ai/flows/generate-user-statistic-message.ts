'use server';

/**
 * @fileOverview A Genkit flow for generating personalized and motivational messages based on user game statistics.
 *
 * - generateUserStatisticMessage - A function that generates a personalized message based on user statistics.
 * - GenerateUserStatisticMessageInput - The input type for the generateUserStatisticMessage function.
 * - GenerateUserStatisticMessageOutput - The return type for the generateUserStatisticMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUserStatisticMessageInputSchema = z.object({
  levelsCompleted: z
    .number()
    .describe('The number of levels the user has completed.'),
  timeTaken: z
    .number()
    .describe('The total time taken by the user to complete levels (in seconds).'),
  currentStreak: z.number().describe('The user\'s current streak of consecutive level completions.'),
  longestStreak: z.number().describe('The user\'s longest streak of consecutive level completions.'),
});
export type GenerateUserStatisticMessageInput = z.infer<
  typeof GenerateUserStatisticMessageInputSchema
>;

const GenerateUserStatisticMessageOutputSchema = z.object({
  message: z.string().describe('A personalized and motivational message based on user statistics.'),
});
export type GenerateUserStatisticMessageOutput = z.infer<
  typeof GenerateUserStatisticMessageOutputSchema
>;

export async function generateUserStatisticMessage(
  input: GenerateUserStatisticMessageInput
): Promise<GenerateUserStatisticMessageOutput> {
  return generateUserStatisticMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUserStatisticMessagePrompt',
  input: {schema: GenerateUserStatisticMessageInputSchema},
  output: {schema: GenerateUserStatisticMessageOutputSchema},
  prompt: `You are an AI game motivator. Generate a personalized and motivational message for the user based on their game statistics.

Here are the user's statistics:
Levels Completed: {{{levelsCompleted}}}
Total Time Taken: {{{timeTaken}}} seconds
Current Streak: {{{currentStreak}}}
Longest Streak: {{{longestStreak}}}

Consider these points when creating the message:
- Congratulate the user on new streaks or high scores.
- Suggest strategies based on past performance (e.g., if time taken is high, suggest focusing on speed).
- Acknowledge their progress and motivate them to continue playing.
- Keep the message concise and engaging.
`,
});

const generateUserStatisticMessageFlow = ai.defineFlow(
  {
    name: 'generateUserStatisticMessageFlow',
    inputSchema: GenerateUserStatisticMessageInputSchema,
    outputSchema: GenerateUserStatisticMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
