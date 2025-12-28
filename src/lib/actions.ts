
'use server';

import { landmarkEnhancerFlow } from "@/ai/flows/landmark-flow";

// This function is now primarily for fetching AI-generated facts.
export async function getLandmarkData(
  state: { facts: string[] } | null,
  formData: { landmarkName: string }
) {
  try {
    const result = await landmarkEnhancerFlow(formData);
    return {
      facts: result.facts
    };
  } catch (error) {
    console.error('Error fetching landmark data:', error);
    // Return a default state or handle the error as appropriate
    return { facts: ["Could not load new facts at this time."] };
  }
}
