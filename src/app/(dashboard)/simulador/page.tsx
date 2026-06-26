'use client'

import { useState, useEffect } from 'react'
import { proyectarInversion, mesesParaLlegar, TASAS, NOMBRES_INVERSION } from '@/lib/calculos'
import { formatearPesos, formatearMeses } from '@/lib/utils'
import { TipoInversion } from '@/types'

const OBJETIVOS_PRESET = [
  { label: 'Moto', emoji: '🏍️', monto: 3200000 },
  { label: 'Auto', emoji: '🚗', monto: 15000000 },
  { label: 'Viaje', emoji: '✈️', monto: 2000000 },
  { label: 'Casa', emoji: '🏠', monto: 80000000 },
  { label: 'Otro', emoji: '🎯', monto: 0 },
]

export default function Simulador() {
  const [sueldo, setSueldo] = useState(500000)
  const [montoObjetivo, setMontoObjetivo] = useState(3200000)
  const [ahorroPorcentaje, setAhorroPorcentaje] = useState(30)
  const [tipoInversion, setTipoInversion] = useState<TipoInversion>('fci')
  const [objetivoLabel, setObjetivoLabel] = useState('Moto')
  const [dolarBlue, setDolarBlue] = useState<number | null>(null)
  const [loadingDolar, setLoadingDolar] = useState(true)

  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const res = await fetch('https://dolarapi.com/v1/dolares/blue')
        const data = await res.json()
        setDolarBlue(data.venta)
      } catch {
        setDolarBlue(1200)
      } finally {
        setLoadingDolar(false)
      }
    }
    fetchDolar()
    const interval = setInterval(fetchDolar, 60000)
    return () => clearInterval(interval)
  }, [])

  const ahorroMensual = Math.round(sueldo * ahorroPorcentaje / 100)
  const meses = mesesParaLlegar(montoObjetivo, ahorroMensual, tipoInversion)
  const resultado = proyectarInversion(ahorroMensual, meses, tipoInversion)
  const mesesSinInvertir = mesesParaLlegar(montoObjetivo, ahorroMensual, 'colchon')
  const mesesAhorrados = mesesSinInvertir > meses ? mesesSinInvertir - meses : 0
  const ahorroSignificativo = mesesAhorrados > 600
  const montoEnDolares = dolarBlue ? Math.round(montoObjetivo / dolarBlue) : null
  const montoFuturo = Math.round(montoObjetivo * Math.pow(1.04, meses))

  return (
    <main className="min-h-screen bg-gray-50">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-green-200 text-xs">↗</span>
          </div>
          <span className="font-medium">Desfinz</span>
        </div>
        <div className="flex items-center gap-3">
          {!loadingDolar && dolarBlue && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              <span>💵 Dólar blue</span>
              <span className="font-bold">${dolarBlue.toLocaleString('es-AR')}</span>
              <span className="text-blue-400 text-xs">en vivo</span>
            </div>
          )}
          <a href="/dashboard" className="text-sm text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg">
            ← Dashboard
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Calculadora de objetivos</h1>
          <p className="text-gray-500 text-sm">Mové los controles y mirá los resultados en tiempo real.</p>
        </div>

        {/* PRESET OBJETIVOS */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">¿Para qué querés ahorrar?</p>
          <div className="flex gap-2 flex-wrap">
            {OBJETIVOS_PRESET.map(obj => (
              <button
                key={obj.label}
                onClick={() => {
                  setObjetivoLabel(obj.label)
                  if (obj.monto > 0) setMontoObjetivo(obj.monto)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all ${
                  objetivoLabel === obj.label
                    ? 'bg-green-800 text-green-100 border-green-800'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {obj.emoji} {obj.label}
              </button>
            ))}
          </div>
        </div>

        {/* INPUTS */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-4">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Tu sueldo mensual
              </label>
              <input
                type="number"
                value={sueldo}
                onChange={e => setSueldo(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
              />
              <p className="text-xs text-gray-400 mt-1">{formatearPesos(sueldo)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Precio del objetivo
              </label>
              <input
                type="number"
                value={montoObjetivo}
                onChange={e => setMontoObjetivo(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formatearPesos(montoObjetivo)}
                {montoEnDolares && (
                  <span className="ml-2 text-blue-500">≈ USD {montoEnDolares.toLocaleString('es-AR')}</span>
                )}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-600">¿Cuánto podés ahorrar por mes?</label>
              <span className="text-sm font-medium text-green-700">{ahorroPorcentaje}% — {formatearPesos(ahorroMensual)}</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              step={5}
              value={ahorroPorcentaje}
              onChange={e => setAhorroPorcentaje(Number(e.target.value))}
              className="w-full accent-green-700"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>5%</span>
              <span>80%</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">¿Dónde vas a poner tus ahorros?</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(TASAS) as TipoInversion[]).map(tipo => (
                <button
                  key={tipo}
                  onClick={() => setTipoInversion(tipo)}
                  className={`py-2 px-3 rounded-lg text-xs border transition-all ${
                    tipoInversion === tipo
                      ? 'bg-green-800 text-green-100 border-green-800'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {NOMBRES_INVERSION[tipo]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="bg-green-800 rounded-xl p-6 mb-4 text-white">
          <p className="text-green-300 text-sm mb-4">Tu resultado en tiempo real</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-3xl font-medium">{formatearPesos(ahorroMensual)}</p>
              <p className="text-green-400 text-xs mt-1">ahorrar por mes</p>
            </div>
            <div>
              <p className="text-3xl font-medium">{formatearMeses(meses)}</p>
              <p className="text-green-400 text-xs mt-1">para llegar</p>
            </div>
            <div>
              <p className="text-3xl font-medium text-yellow-300">
  {ahorroSignificativo ? 'Mucho más rápido' : mesesAhorrados > 0 ? `${formatearMeses(mesesAhorrados)} menos` : 'igual'}
</p>
<p className="text-green-400 text-xs mt-1">vs guardarlo en efectivo</p>
            </div>
          </div>

          {/* ALERTA INFLACION */}
          <div className="bg-green-700 rounded-lg px-4 py-3">
            <p className="text-xs text-green-200">
              ⚠️ Modo inflación honesta — Si esperás {formatearMeses(meses)}, tu {objetivoLabel.toLowerCase()} va a costar aproximadamente{' '}
              <span className="text-yellow-300 font-medium">{formatearPesos(montoFuturo)}</span> por la inflación.
              Empezar hoy te ahorra {formatearPesos(montoFuturo - montoObjetivo)}.
            </p>
          </div>
        </div>

        {/* COMPARATIVA */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">Comparativa de opciones</p>
          <div className="flex flex-col gap-3">
            {(Object.keys(TASAS) as TipoInversion[]).map(tipo => {
              const m = mesesParaLlegar(montoObjetivo, ahorroMensual, tipo)
              const isSelected = tipo === tipoInversion
              const pct = Math.min(100, Math.round((mesesSinInvertir / m) * 100))
              return (
                <div key={tipo} className={`flex items-center gap-3 ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                  <span className="text-xs text-gray-500 w-32 flex-shrink-0">{NOMBRES_INVERSION[tipo]}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-20 text-right">{formatearMeses(m)}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </main>
  )
}