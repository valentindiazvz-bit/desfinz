export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-green-200 text-xs">↗</span>
          </div>
          <span className="font-medium text-lg">Desfinz</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-gray-500">Cómo funciona</a>
          <a href="#" className="text-sm text-gray-500">Precios</a>
          <a href="/registro" className="bg-green-800 text-green-100 text-sm font-medium px-4 py-2 rounded-lg">
            Empezar gratis
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center px-6 py-16">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-900 text-xs font-medium px-3 py-1 rounded-full mb-6">
          ✓ Para argentinos que quieren llegar a fin de mes y más allá
        </div>
        <h1 className="text-4xl font-medium text-gray-900 leading-tight max-w-lg mx-auto mb-4">
          Tu plata, <span className="text-green-700">bajo control</span> por primera vez
        </h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          Calculá cuánto ahorrar para lo que querés, qué hacer con tu sueldo y cómo llegar a tus metas reales — sin jerga financiera.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="/registro" className="bg-green-800 text-green-100 font-medium px-6 py-3 rounded-lg">
            Calculá tu objetivo gratis
          </a>
          <a href="#como-funciona" className="text-gray-500 border border-gray-200 px-6 py-3 rounded-lg">
            Ver cómo funciona
          </a>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
          <span>✓ Sin tarjeta de crédito</span>
          <span>✓ Gratis para empezar</span>
          <span>✓ Contexto argentino real</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 pb-16 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="border border-gray-100 rounded-xl p-5">
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-green-700 text-lg">🎯</span>
          </div>
          <p className="font-medium text-sm mb-1">Metas reales</p>
          <p className="text-xs text-gray-500 leading-relaxed">De un sueldo normal a una moto, un auto o un viaje. Con números reales.</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-5">
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-green-700 text-lg">📈</span>
          </div>
          <p className="font-medium text-sm mb-1">Inflación incluida</p>
          <p className="text-xs text-gray-500 leading-relaxed">Calculamos con la realidad argentina: FCI, CEDEAR y plazo fijo.</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-5">
          <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-3">
            <span className="text-green-700 text-lg">🤝</span>
          </div>
          <p className="font-medium text-sm mb-1">Asesores reales</p>
          <p className="text-xs text-gray-500 leading-relaxed">Cuando lo necesitás, hablás con una persona. No con un bot.</p>
        </div>
      </section>

    </main>
  )
}