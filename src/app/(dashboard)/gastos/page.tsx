'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatearPesos } from '@/lib/utils'

const CATEGORIAS = [
  { label: 'Comida', emoji: '🍔', color: 'bg-orange-100 text-orange-700' },
  { label: 'Transporte', emoji: '🚗', color: 'bg-blue-100 text-blue-700' },
  { label: 'Salud', emoji: '💊', color: 'bg-red-100 text-red-700' },
  { label: 'Entretenimiento', emoji: '🎬', color: 'bg-purple-100 text-purple-700' },
  { label: 'Servicios', emoji: '💡', color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Ropa', emoji: '👕', color: 'bg-pink-100 text-pink-700' },
  { label: 'Imprevisto', emoji: '⚠️', color: 'bg-red-100 text-red-800' },
  { label: 'Otro', emoji: '📦', color: 'bg-gray-100 text-gray-700' },
]

interface Gasto {
  id: string
  descripcion: string
  monto: number
  categoria: string
  tipo: string
  fecha: string
}

const sanitizar = (texto: string): string => {
  return texto
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 200)
}

export default function Gastos() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('Comida')
  const [tipo, setTipo] = useState('normal')
  const [loading, setLoading] = useState(false)
  const [loadingGastos, setLoadingGastos] = useState(true)
  const supabase = createClient()

  const fetchGastos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('gastos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    setGastos(data || [])
    setLoadingGastos(false)
  }

  useEffect(() => { fetchGastos() }, [])

  const handleAgregar = async () => {
    if (!descripcion || !monto) return

    if (isNaN(Number(monto)) || Number(monto) <= 0 || Number(monto) > 999999999) {
      alert('Monto inválido')
      return
    }

    const descripcionLimpia = sanitizar(descripcion)
    if (descripcionLimpia.length < 2) {
      alert('Descripción demasiado corta')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('gastos').insert({
      user_id: user.id,
      descripcion: descripcionLimpia,
      monto: Number(monto),
      categoria,
      tipo,
      fecha: new Date().toISOString().split('T')[0]
    })

    setDescripcion('')
    setMonto('')
    setLoading(false)
    fetchGastos()
  }

  const totalMes = gastos
    .filter(g => g.fecha >= new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
    .reduce((acc, g) => acc + g.monto, 0)

  const totalImprevistos = gastos
    .filter(g => g.tipo === 'imprevisto')
    .reduce((acc, g) => acc + g.monto, 0)

  const gastosPorCategoria = CATEGORIAS.map(cat => ({
    ...cat,
    total: gastos.filter(g => g.categoria === cat.label).reduce((acc, g) => acc + g.monto, 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  return (
    <main className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-green-200 text-xs">↗</span>
          </div>
          <span className="font-medium">Desfinz</span>
        </div>
        <a href="/dashboard" className="text-sm text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg">
          ← Dashboard
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Mis gastos</h1>
          <p className="text-gray-500 text-sm">Registrá cada gasto y analizá en qué se va tu plata.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 mb-1">Total este mes</p>
            <p className="text-2xl font-medium text-gray-900">{formatearPesos(totalMes)}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 mb-1">Gastos registrados</p>
            <p className="text-2xl font-medium text-gray-900">{gastos.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 mb-1">Total imprevistos</p>
            <p className="text-2xl font-medium text-red-600">{formatearPesos(totalImprevistos)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Agregar gasto</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Ej: Supermercado, nafta, médico..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Monto</label>
                <input
                  type="number"
                  value={monto}
                  onChange={e => setMonto(e.target.value)}
                  placeholder="$ 0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Categoría</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {CATEGORIAS.map(cat => (
                    <button
                      key={cat.label}
                      onClick={() => {
                        setCategoria(cat.label)
                        if (cat.label === 'Imprevisto') setTipo('imprevisto')
                        else setTipo('normal')
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs border transition-all text-center ${
                        categoria === cat.label
                          ? 'bg-green-800 text-green-100 border-green-800'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {cat.emoji}
                      <span className="block text-xs mt-0.5">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAgregar}
                disabled={loading || !descripcion || !monto}
                className="bg-green-800 text-green-100 font-medium py-2.5 rounded-lg text-sm disabled:opacity-60 mt-1"
              >
                {loading ? 'Guardando...' : '+ Agregar gasto'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {gastosPorCategoria.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <p className="text-sm font-medium text-gray-700 mb-3">Por categoría</p>
                <div className="flex flex-col gap-2">
                  {gastosPorCategoria.map(cat => (
                    <div key={cat.label} className="flex items-center gap-2">
                      <span className="text-sm w-6">{cat.emoji}</span>
                      <span className="text-xs text-gray-500 w-24">{cat.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-green-600"
                          style={{ width: `${Math.min(100, (cat.total / totalMes) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-24 text-right">
                        {formatearPesos(cat.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-100 rounded-xl p-5 flex-1">
              <p className="text-sm font-medium text-gray-700 mb-3">Últimos gastos</p>
              {loadingGastos ? (
                <p className="text-xs text-gray-400">Cargando...</p>
              ) : gastos.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-2xl mb-2">💸</p>
                  <p className="text-xs text-gray-400">Todavía no hay gastos registrados</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {gastos.map(gasto => {
                    const cat = CATEGORIAS.find(c => c.label === gasto.categoria)
                    return (
                      <div key={gasto.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cat?.emoji || '📦'}</span>
                          <div>
                            <p className="text-xs font-medium text-gray-700">{gasto.descripcion}</p>
                            <p className="text-xs text-gray-400">{gasto.fecha}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${gasto.tipo === 'imprevisto' ? 'text-red-600' : 'text-gray-700'}`}>
                            {formatearPesos(gasto.monto)}
                          </p>
                          {gasto.tipo === 'imprevisto' && (
                            <p className="text-xs text-red-400">imprevisto</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}