/**
 * Constantes de temas del juego de memoria
 * Cada tema representa una API diferente
 */

export const THEMES = {
  RICK_AND_MORTY: {
    id: 'rickandmorty',
    name: 'Rick and Morty',
    description: 'Dimensiones infinitas, personajes únicos',
    color: 'from-green-400 to-blue-500',
    icon: '🛸',
    api: 'https://rickandmortyapi.com/api',
    image: '/images/themes/nuevo rick and morthyn.gif'
  },
  STAR_WARS: {
    id: 'starwars',
    name: 'Star Wars',
    description: 'La galaxia muy, muy lejana',
    color: 'from-yellow-400 to-orange-500',
    icon: '⚔️',
    api: 'https://swapi.dev/api',
    image: '/images/themes/gif start wars.gif'
  },
  GAME_OF_THRONES: {
    id: 'gameofthrones',
    name: 'Game of Thrones',
    description: 'Los Siete Reinos te esperan',
    color: 'from-red-500 to-gray-700',
    icon: '🐉',
    api: 'https://thronesapi.com/api/v2',
    image: '/images/themes/gif Game of throne.gif'
  },
  POKEMON: {
    id: 'pokemon',
    name: 'Pokémon',
    description: 'Hazte con todos',
    color: 'from-red-400 to-yellow-400',
    icon: '⚡',
    api: 'https://pokeapi.co/api/v2',
    image: '/images/themes/pokemon.gif'
  },
  MIXED: {
    id: 'mixed',
    name: 'Multiverso',
    description: 'Todos los universos combinados',
    color: 'from-purple-400 via-pink-500 to-blue-500',
    icon: '🌌',
    api: null, // Combinación de todas las APIs
    image: '/images/themes/multiverso.gif'
  }
};

export const THEME_LIST = Object.values(THEMES);

