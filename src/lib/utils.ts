import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TILE_COLORS = [
  "bg-zinc-300", // 0
  "bg-blue-500", // 1
  "bg-green-500", // 2
  "bg-yellow-500", // 3
  "bg-purple-500", // 4
  "bg-pink-500", // 5
  "bg-indigo-500", // 6
  "bg-teal-500", // 7
  "bg-orange-500", // 8
];

export function getTileColor(value: number): string {
  return TILE_COLORS[value] || "bg-muted";
}
