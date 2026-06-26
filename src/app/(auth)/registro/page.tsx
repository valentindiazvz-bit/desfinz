'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Registro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleRegistro = async () => {
    setLoading(true)
    setError('')

    if (!nombre || !email || !password || !confirmPassword) {
      setError('Completá todos los campos')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-md">

        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-green-200 text-xs">↗</span>
          </div>
          <span className="font-medium text-lg">Desfinz</span>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-1">Creá tu cuenta</h1>
        <p className="text-gray-500 text-sm mb-6">Gratis para siempre. Sin tarjeta de crédito.</p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repetí tu contraseña"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
            />
          </div>

          <button
            onClick={handleRegistro}
            disabled={loading}
            className="bg-green-800 text-green-100 font-medium py-3 rounded-lg text-sm disabled:opacity-60"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-green-700 font-medium">
            Iniciá sesión
          </Link>
        </p>

        <p className="text-center text-xs text-gray-300 mt-4 leading-relaxed">
          Al registrarte aceptás nuestros términos y condiciones y política de privacidad.
        </p>

      </div>
    </main>
  )
}