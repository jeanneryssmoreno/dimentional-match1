/**
 * Página Principal - Home
 * Selección de temas con modal de reglas integrado
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEME_LIST } from '../constants/themes';
import ThemeCard from '../components/common/ThemeCard';
import RulesModal from '../components/game/RulesModal';
import Button from '../components/ui/Button';

export default function Home() {
  const [showRules, setShowRules] = useState(false);
  const navigate = useNavigate();

  const handleThemeSelect = (theme) => {
    // Navegar al juego con el tema seleccionado
    navigate(`/game/${theme.id}`);
  };

  const handleShowRules = () => {
    setShowRules(true);
  };

  const handleCloseRules = () => {
    setShowRules(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Patrón de fondo tipo juego de memoria */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-2 h-full p-4">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-lg ${
                i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
              } animate-pulse`}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>

      {/* Efectos de partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          {/* Logo principal estilo juego de memoria */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl mb-6 shadow-2xl transform hover:rotate-6 transition-transform duration-500 border-4 border-white/20">
              <div className="grid grid-cols-2 gap-1 p-4">
                <div className="w-6 h-6 bg-white/80 rounded-md flex items-center justify-center text-lg">🧠</div>
                <div className="w-6 h-6 bg-white/80 rounded-md flex items-center justify-center text-lg">⚡</div>
                <div className="w-6 h-6 bg-white/80 rounded-md flex items-center justify-center text-lg">🎯</div>
                <div className="w-6 h-6 bg-white/80 rounded-md flex items-center justify-center text-lg">🌟</div>
              </div>
            </div>
            
            {/* Efectos de brillo alrededor del logo */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 drop-shadow-2xl leading-tight tracking-tight">
            MEMORY
            <br />
            <span className="text-5xl md:text-7xl bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              MATCH
            </span>
          </h1>

          {/* Subtítulo con estilo gaming */}
          <div className="mb-10">
            <p className="text-xl md:text-2xl font-bold text-white/90 mb-4 uppercase tracking-wide">
              🎮 Ultimate Memory Challenge 🎮
            </p>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Test your memory across infinite dimensions. Match characters, unlock universes, and become the ultimate champion!
            </p>
          </div>

          {/* Botón de reglas estilo gaming */}
          <div className="relative inline-block mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
            <Button 
              onClick={handleShowRules}
              variant="outline"
              size="large"
              className="relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 font-bold uppercase tracking-wider shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-110 px-8 py-4"
            >
              <span className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">📖</div>
                Game Rules & Guide
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">🎯</div>
              </span>
            </Button>
          </div>
        </section>

        {/* Selección de Temas */}
        <section className="px-4 mb-20">
          {/* Título de sección estilo arcade */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 blur-lg opacity-50 animate-pulse"></div>
              <h2 className="relative text-4xl md:text-6xl font-black text-white bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent uppercase tracking-wider mb-4">
                🎮 SELECT UNIVERSE 🎮
              </h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-violet-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-semibold">
              Choose your battlefield and prove your memory skills!
            </p>
          </div>
          
          {/* Contenedor de cards estilo arcade */}
          <div className="relative max-w-7xl mx-auto">
            {/* Efectos de borde neón */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl rounded-3xl animate-pulse"></div>
            
            {/* Scroll horizontal con diseño gaming */}
            <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10 p-8 overflow-hidden">
              {/* Patrón de circuito en el fondo */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 0,10 L 10,10 L 10,0 L 20,0 M 10,10 L 10,20 M 10,10 L 20,10" stroke="white" strokeWidth="0.5" fill="none"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#circuit)"/>
                </svg>
              </div>
              
              {/* Gradientes laterales mejorados */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 via-black/20 to-transparent z-10 pointer-events-none"></div>
              
              {/* Cards horizontales */}
              <div className="flex gap-8 overflow-x-auto pb-6 px-20 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {THEME_LIST.map((theme, index) => (
                  <div 
                    key={theme.id} 
                    className="flex-shrink-0 w-80 transform transition-all duration-700 hover:scale-110"
                    style={{
                      animationDelay: `${index * 0.15}s`,
                      animation: 'slideInFromBottom 1s ease-out forwards'
                    }}
                  >
                    <div className="relative group">
                      {/* Efecto de holograma */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 transform scale-110"></div>
                      
                      {/* Borde neón animado */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                      <div className="absolute inset-0.5 rounded-2xl bg-black/80"></div>
                      
                      {/* Card principal */}
                      <div className="relative">
                        <ThemeCard
                          theme={theme}
                          onSelect={handleThemeSelect}
                        />
                      </div>
                      
                      {/* Número de nivel estilo arcade */}
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-black text-xl shadow-2xl border-4 border-white/20 group-hover:animate-spin">
                        {index + 1}
                      </div>
                      
                      {/* Indicador de dificultad */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < (index + 1) ? 'bg-yellow-400' : 'bg-gray-600'
                              } shadow-lg`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Indicador de navegación estilo gaming */}
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                  <div className="flex items-center gap-2 text-white/80">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                      ←
                    </div>
                    <span className="font-bold uppercase tracking-wide text-sm">Scroll to explore</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Características del Juego */}
        <section className="px-4 mb-20">
          {/* Contenedor principal estilo consola */}
          <div className="max-w-6xl mx-auto relative">
            {/* Efectos de borde neón */}
            <div className="absolute -inset-6 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 blur-2xl rounded-3xl"></div>
            
            <div className="relative bg-black/30 backdrop-blur-sm rounded-3xl border-2 border-green-400/30 p-8 overflow-hidden">
              {/* Patrón de matriz en el fondo */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-20 gap-1 h-full">
                  {Array.from({ length: 400 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-green-400 rounded-sm animate-pulse"
                      style={{ animationDelay: `${i * 0.01}s` }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Título de características */}
              <div className="text-center mb-12 relative z-10">
                <div className="inline-block relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 blur-lg opacity-50 animate-pulse"></div>
                  <h2 className="relative text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 uppercase tracking-wider">
                    ⚡ GAME FEATURES ⚡
                  </h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full mt-4"></div>
              </div>

              {/* Grid de características estilo gaming */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {[
                  {
                    icon: "⚡",
                    title: "5 Difficulty Levels",
                    description: "From rookie to master",
                    color: "from-yellow-400 to-orange-500",
                    bgColor: "bg-yellow-500/10",
                    borderColor: "border-yellow-400/30"
                  },
                  {
                    icon: "🎯",
                    title: "Combo System",
                    description: "Chain matches for bonus",
                    color: "from-green-400 to-emerald-500",
                    bgColor: "bg-green-500/10",
                    borderColor: "border-green-400/30"
                  },
                  {
                    icon: "🏆",
                    title: "Score Ranking",
                    description: "Beat your records",
                    color: "from-blue-400 to-cyan-500",
                    bgColor: "bg-blue-500/10",
                    borderColor: "border-blue-400/30"
                  },
                  {
                    icon: "🌌",
                    title: "5 Universes",
                    description: "Epic crossover battles",
                    color: "from-purple-400 to-pink-500",
                    bgColor: "bg-purple-500/10",
                    borderColor: "border-purple-400/30"
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`group relative ${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-6 hover:scale-105 transition-all duration-500 cursor-pointer`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'slideInFromBottom 0.8s ease-out forwards'
                    }}
                  >
                    {/* Efecto de brillo en hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}></div>
                    
                    {/* Ícono principal */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-4 text-2xl shadow-2xl group-hover:animate-bounce`}>
                      {feature.icon}
                    </div>
                    
                    {/* Contenido */}
                    <h3 className="font-black text-white mb-2 text-lg uppercase tracking-wide">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm font-semibold">
                      {feature.description}
                    </p>
                    
                    {/* Barra de progreso decorativa */}
                    <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${feature.color} rounded-full animate-pulse`}
                        style={{ width: `${75 + index * 5}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estadísticas del juego */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-center">
                {[
                  { number: "1000+", label: "Players", color: "text-cyan-400" },
                  { number: "50+", label: "Characters", color: "text-green-400" },
                  { number: "∞", label: "Fun", color: "text-pink-400" }
                ].map((stat, index) => (
                  <div key={index} className="relative group">
                    <div className={`text-4xl md:text-6xl font-black ${stat.color} mb-2 group-hover:animate-pulse`}>
                      {stat.number}
                    </div>
                    <div className="text-white/80 font-bold uppercase tracking-wider text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Reglas */}
      <RulesModal 
        isOpen={showRules}
        onClose={handleCloseRules}
      />
    </div>
  );
}