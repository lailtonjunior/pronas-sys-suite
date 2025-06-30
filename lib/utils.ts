import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, "")
  return numbers
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18)
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "")
  return numbers
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15)
}

export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, "")
  return numbers.replace(/(\d{5})(\d)/, "$1-$2").substring(0, 9)
}
