'use server';

import { landmarkEnhancerFlow } from "@/ai/flows/landmark-flow";

// This function is now primarily for fetching AI-generated facts.
// The image URL part of its state is no longer used by the client.
export async function getLandmarkData(
  state: { facts: string[] } | null,
  formData: { landmarkName: string }
) {
  try {
    // We are now only interested in the facts from the flow.
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
