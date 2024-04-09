import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function toFirstUpper(string){
  if(!string || typeof(string) !== 'string') return ''
  return string[0].toUpperCase() + string.slice(1,string.length)
}