// Simple pseudo-random number generator based on a seed (date string)
export const seededRandom = (seed: string) => {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < seed.length; i++) {
      k = seed.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1, k);
      h2 = h3 ^ Math.imul(h2, k);
      h3 = h4 ^ Math.imul(h3, k);
      h4 = h1 ^ Math.imul(h4, k);
  }
  return (h1>>>0) / 4294967296;
}

export const getTodaysDateKey = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
