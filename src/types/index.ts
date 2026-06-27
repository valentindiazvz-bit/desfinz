export type Plan = 'free' | 'premium' | 'pro'
export type PerfilRiesgo = 'conservador' | 'moderado' | 'agresivo'
export type TipoObjetivo = 'vehiculo' | 'viaje' | 'electrodomestico' | 'deuda' | 'otro'
export type TipoInversion = 'colchon' | 'plazo_fijo' | 'fci' | 'cedear'

export interface Profile {
  id: string
  email: string
  nombre: string | null
  sueldo_mensual: number | null
  moneda: string
  plan: Plan
  perfil_riesgo: PerfilRiesgo | null
  created_at: string
}

export interface Objetivo {
  id: string
  user_id: string
  nombre: string
  tipo: TipoObjetivo
  monto_objetivo: number
  ahorro_mensual: number | null
  fecha_inicio: string
  fecha_objetivo: string | null
  activo: boolean
  created_at: string
}

export interface Simulacion {
  id: string
  user_id: string
  objetivo_id: string | null
  monto_mensual: number
  plazo_meses: number
  tipo_inversion: TipoInversion
  resultado_final: number
  tasa_usada: number
  created_at: string
}

export interface ResultadoSimulacion {
  montoFinal: number
  totalAportado: number
  gananciaNominal: number
  gananciaReal: number
  mesesHastaObjetivo: number
  proyeccionMensual: { mes: number; saldo: number }[]
}