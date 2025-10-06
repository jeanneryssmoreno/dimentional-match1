/**
 * Modal de Reglas del Juego
 * Muestra instrucciones, niveles y características especiales
 * Adaptado para usar la configuración de Developer 3
 */

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { GAME_RULES, getGameLevelsForDisplay, getDifficultyColor } from '../../constants/gameRules';

export default function RulesModal({ isOpen, onClose }) {
  const gameLevels = getGameLevelsForDisplay();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📖 Reglas del Juego"
      size="large"
    >
      <div className="space-y-8">
        {/* Objetivo */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
            🎯 Objetivo
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {GAME_RULES.objective}
          </p>
        </section>

        {/* Cómo Jugar */}
        <section>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            📋 Cómo Jugar
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {GAME_RULES.howToPlay.map((step, index) => (
              <div 
                key={index}
                className="flex items-start p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
              >
                <span className="text-3xl mr-3 flex-shrink-0">{step.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabla de Niveles */}
        <section>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            🎮 Niveles del Juego
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="py-3 px-4 text-left rounded-tl-lg">Nivel</th>
                  <th className="py-3 px-4 text-center">Cartas</th>
                  <th className="py-3 px-4 text-center">Tiempo</th>
                  <th className="py-3 px-4 text-center">Dificultad</th>
                  <th className="py-3 px-4 text-left rounded-tr-lg">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {gameLevels.map((level, index) => (
                  <tr 
                    key={level.level}
                    className={`${
                      index % 2 === 0 
                        ? 'bg-gray-50 dark:bg-gray-700/30' 
                        : 'bg-white dark:bg-gray-800/30'
                    } border-b border-gray-200 dark:border-gray-700`}
                  >
                    <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                      Nivel {level.level}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">
                      {level.cards} cartas
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">
                      {level.time}s
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(level.difficulty)}`}>
                        {level.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {level.desc}
                      {level.special && (
                        <span className="block text-xs text-purple-600 dark:text-purple-400 mt-1">
                          ⭐ {level.special}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Características Especiales */}
        <section>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            ✨ Características Especiales
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {GAME_RULES.specialFeatures.map((feature, index) => (
              <div 
                key={index}
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
              >
                <div className="text-3xl mb-2 text-center">{feature.icon}</div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-center">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sistema de Puntuación */}
        <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
            🏆 Sistema de Puntuación
          </h3>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>• <strong>{GAME_RULES.scoring.matchPoints} puntos base</strong> por cada par encontrado</li>
            <li>• <strong>Bono de tiempo</strong>: {GAME_RULES.scoring.timeBonus}</li>
            <li>• <strong>Bono de racha</strong>: {GAME_RULES.scoring.streakBonus}</li>
            <li>• <strong>Multiplicador de nivel</strong>: {GAME_RULES.scoring.levelMultiplier}</li>
          </ul>
        </section>

        {/* Botón Cerrar */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={onClose}
            size="large"
            className="px-12"
          >
            ¡Entendido, Vamos a Jugar! 🎮
          </Button>
        </div>
      </div>
    </Modal>
  );
}