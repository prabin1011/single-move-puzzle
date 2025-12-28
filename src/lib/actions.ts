'use server';

import { landmarkEnhancerFlow } from "@/ai/flows/landmark-flow";

export async function getLandmarkData(
  state: { imageUrl: string; facts: string[] } | null,
  formData: { landmarkName: string }
) {
  try {
    const result = await landmarkEnhancerFlow(formData);
    return {
      imageUrl: result.imageUrl,
      facts: result.facts
    };
  } catch (error) {
    console.error('Error fetching landmark data:', error);
    return null;
  }
}
