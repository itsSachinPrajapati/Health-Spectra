import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This merges Tailwind classes together and removes duplicates
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
