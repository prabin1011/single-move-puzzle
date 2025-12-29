
'use server';

// This file is kept for potential future server actions,
// but the AI fact generation has been removed for performance
// and reliability as requested. Facts are now curated in levels.ts.

export async function getLandmarkData(
  state: { facts: string[] } | null,
  formData: { landmarkName: string }
) {
  // This function is no longer needed for facts but is kept to avoid breaking imports.
  // It returns a placeholder to avoid errors.
  console.log(`Action called for ${formData.landmarkName}, but facts are now static.`);
  return { facts: ["New facts are now loaded with each level."] };
}
