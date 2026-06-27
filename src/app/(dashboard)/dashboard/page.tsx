'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('nombre')
        .eq('id', user.id)
        .single()

      setNombre(profile?.nombre || user.email || 'Usuario')
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!mounted || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-green-200 text-xs">↗</span>
          </div>
          <span className="font-medium">Desfinz</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hola, {nombre} 👋</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Tu panel financiero</h1>
          <p className="text-gray-500 text-sm">Organizá tus metas, simulá inversiones y tomá el control de tu plata.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push('/simulador')}
            className="bg-white border border-gray-100 rounded-xl p-5 text-left hover:border-green-300 transition-all"
          >
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">📈</span>
            </div>
            <p className="font-medium text-sm mb-1">Simulador</p>
            <p className="text-xs text-gray-400 mb-3">Calculá cuánto crecen tus ahorros.</p>
            <span className="text-xs text-green-700 font-medium">Simular ahora →</span>
          </button>

          <button
            onClick={() => router.push('/gastos')}
            className="bg-white border border-gray-100 rounded-xl p-5 text-left hover:border-green-300 transition-all"
          >
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">💸</span>
            </div>
            <p className="font-medium text-sm mb-1">Gastos</p>
            <p className="text-xs text-gray-400 mb-3">Registrá y analizá tus gastos.</p>
            <span className="text-xs text-green-700 font-medium">Ver gastos →</span>
          </button>

          <button
            onClick={() => router.push('/simulador')}
            className="bg-white border border-gray-100 rounded-xl p-5 text-left hover:border-green-300 transition-all"
          >
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">🎯</span>
            </div>
            <p className="font-medium text-sm mb-1">Mis objetivos</p>
            <p className="text-xs text-gray-400 mb-3">Moto, auto, viaje — lo que sea.</p>
            <span className="text-xs text-green-700 font-medium">Agregar objetivo →</span>
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <p className="font-medium text-gray-900 mb-1">Empezá con tu primer objetivo</p>
          <p className="text-sm text-gray-400 mb-5">
            Decinos qué querés lograr y te decimos exactamente cómo llegar.
          </p>
          <button
            onClick={() => router.push('/simulador')}
            className="bg-green-800 text-green-100 text-sm font-medium px-6 py-2.5 rounded-lg"
          >
            Crear mi primer objetivo
          </button>
        </div>

      </div>
    </main>
  )
}