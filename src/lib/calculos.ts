import { ResultadoSimulacion, TipoInversion } from '@/types'

export const TASAS: Record<TipoInversion, number> = {
  colchon: 0,
  plazo_fijo: 0.062,
  fci: 0.082,
  cedear: 0.12,
}

export const NOMBRES_INVERSION: Record<TipoInversion, string> = {
  colchon: 'Bajo el colchón',
  plazo_fijo: 'Plazo Fijo',
  fci: 'FCI',
  cedear: 'CEDEARs',
}

export const INFLACION_MENSUAL = 0.04

export function calcularAhorroMensual(
  montoObjetivo: number,
  mesesPlazo: number,
  tasaMensual: number = 0
): number {
  if (tasaMensual === 0) return montoObjetivo / mesesPlazo
  return (montoObjetivo * tasaMensual) / (Math.pow(1 + tasaMensual, mesesPlazo) - 1)
}

export function proyectarInversion(
  aporteMensual: number,
  meses: number,
  tipoInversion: TipoInversion
): ResultadoSimulacion {
  const tasaMensual = TASAS[tipoInversion]
  let saldo = 0
  const proyeccionMensual = []

  for (let i = 1; i <= meses; i++) {
    saldo = (saldo + aporteMensual) * (1 + tasaMensual)
    proyeccionMensual.push({ mes: i, saldo: Math.round(saldo) })
  }

  const totalAportado = aporteMensual * meses
  const factorInflacion = Math.pow(1 + INFLACION_MENSUAL, meses)

  return {
    montoFinal: Math.round(saldo),
    totalAportado,
    gananciaNominal: Math.round(saldo - totalAportado),
    gananciaReal: Math.round(saldo / factorInflacion - totalAportado),
    mesesHastaObjetivo: meses,
    proyeccionMensual,
  }
}

export function mesesParaLlegar(
  montoObjetivo: number,
  aporteMensual: number,
  tipoInversion: TipoInversion
): number {
  const tasaMensual = TASAS[tipoInversion]
  if (tasaMensual === 0) return Math.ceil(montoObjetivo / aporteMensual)
  let saldo = 0
  let meses = 0
  while (saldo < montoObjetivo && meses < 600) {
    saldo = (saldo + aporteMensual) * (1 + tasaMensual)
    meses++
  }
  return meses
}