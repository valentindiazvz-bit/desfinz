import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatearPesos(monto: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(monto)
}

export function formatearMeses(meses: number): string {
  if (meses < 12) return `${meses} meses`
  const años = Math.floor(meses / 12)
  const mesesRestantes = meses % 12
  if (mesesRestantes === 0) return `${años} año${años > 1 ? 's' : ''}`
  return `${años} año${años > 1 ? 's' : ''} y ${mesesRestantes} meses`
}