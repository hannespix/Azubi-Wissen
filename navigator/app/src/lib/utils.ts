import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...eingaben: ClassValue[]) {
  return twMerge(clsx(eingaben));
}
