/**
 * Hook para manejar efectos de sonido del juego
 */

import { useCallback, useRef } from 'react';

export function useSoundEffects() {
  const audioContextRef = useRef(null);

  // Inicializar AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Reanudar el contexto si está suspendido (requerido por algunos navegadores)
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      } catch (error) {
        console.warn('AudioContext no está disponible:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  // Crear un tono específico
  const createTone = useCallback((frequency, duration, volume = 0.3) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error al crear tono:', error);
    }
  }, [getAudioContext]);

  // Función para asegurar que el AudioContext esté activo
  const ensureAudioContext = useCallback(() => {
    const audioContext = getAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(console.warn);
    }
  }, [getAudioContext]);

  // Sonido de carta volteada
  const playFlipSound = useCallback(() => {
    ensureAudioContext();
    setTimeout(() => createTone(800, 0.1, 0.2), 10);
  }, [createTone, ensureAudioContext]);

  // Sonido de match (pareja encontrada)
  const playMatchSound = useCallback(() => {
    ensureAudioContext();
    setTimeout(() => {
      // Acorde ascendente
      createTone(523, 0.2, 0.3); // C5
      setTimeout(() => createTone(659, 0.2, 0.3), 100); // E5
      setTimeout(() => createTone(784, 0.3, 0.3), 200); // G5
    }, 10);
  }, [createTone, ensureAudioContext]);

  // Sonido de aplausos de victoria
  const playVictorySound = useCallback(() => {
    ensureAudioContext();
    setTimeout(() => {
      // Simular aplausos con ruido blanco y frecuencias aleatorias
      const applausePattern = [
        // Primer aplauso fuerte
        { time: 0, intensity: 0.4, duration: 0.15 },
        { time: 0.1, intensity: 0.3, duration: 0.1 },
        { time: 0.2, intensity: 0.35, duration: 0.12 },
        
        // Pausa breve
        { time: 0.4, intensity: 0.2, duration: 0.08 },
        { time: 0.5, intensity: 0.25, duration: 0.1 },
        
        // Segundo aplauso más intenso
        { time: 0.7, intensity: 0.45, duration: 0.2 },
        { time: 0.8, intensity: 0.4, duration: 0.15 },
        { time: 0.9, intensity: 0.35, duration: 0.12 },
        { time: 1.0, intensity: 0.3, duration: 0.1 },
        
        // Aplauso final sostenido
        { time: 1.2, intensity: 0.5, duration: 0.3 },
        { time: 1.3, intensity: 0.45, duration: 0.25 },
        { time: 1.4, intensity: 0.4, duration: 0.2 },
        { time: 1.5, intensity: 0.3, duration: 0.15 },
        { time: 1.6, intensity: 0.2, duration: 0.1 },
      ];

      applausePattern.forEach(clap => {
        setTimeout(() => {
          // Crear múltiples tonos aleatorios para simular aplausos
          for (let i = 0; i < 8; i++) {
            setTimeout(() => {
              const freq = 100 + Math.random() * 300; // Frecuencias bajas para simular palmadas
              createTone(freq, clap.duration * 0.3, clap.intensity * 0.1);
            }, Math.random() * 50);
          }
          
          // Agregar ruido de alta frecuencia para el "crack" de los aplausos
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              const freq = 800 + Math.random() * 1200;
              createTone(freq, clap.duration * 0.1, clap.intensity * 0.05);
            }, Math.random() * 30);
          }
        }, clap.time * 1000);
      });
    }, 10);
  }, [createTone, ensureAudioContext]);

  // Sonido de barajeo
  const playShuffleSound = useCallback(() => {
    ensureAudioContext();
    setTimeout(() => {
      // Sonido de cartas mezclándose
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const freq = 200 + Math.random() * 400;
          createTone(freq, 0.1, 0.1);
        }, i * 100);
      }
    }, 10);
  }, [createTone, ensureAudioContext]);

  // Sonido de error/fallo
  const playErrorSound = useCallback(() => {
    ensureAudioContext();
    setTimeout(() => createTone(150, 0.3, 0.2), 10);
  }, [createTone, ensureAudioContext]);

  return {
    playFlipSound,
    playMatchSound,
    playVictorySound,
    playShuffleSound,
    playErrorSound
  };
}
