/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Achievement } from '../../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_contact',
    title: 'Primer Contacto',
    description: 'Completa con éxito tu primera misión de memoria espacial.',
    icon: 'compass',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 150,
  },
  {
    id: 'perfectionist',
    title: 'Precisión Orbital',
    description: 'Termina cualquier nivel con un 75% o más de precisión sin desperdiciar movimientos.',
    icon: 'crosshair',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 250,
  },
  {
    id: 'speed_demon',
    title: 'Salto Hiperespacial',
    description: 'Supera una partida de Contrarreloj con más de 15 segundos restantes en el cronómetro.',
    icon: 'zap',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 300,
  },
  {
    id: 'iron_will',
    title: 'Maniobra Eficiente',
    description: 'Gana en Movimientos Limitados con al menos 4 movimientos de reserva.',
    icon: 'shield',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 300,
  },
  {
    id: 'photographic_mind',
    title: 'Memoria Fotográfica',
    description: 'Triunfa en el modo Memoria Extrema memorizando el despliegue preliminar.',
    icon: 'eye',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 350,
  },
  {
    id: 'daily_explorer',
    title: 'Pionero Diario',
    description: 'Completa el Desafío Diario astronómico del día.',
    icon: 'calendar',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 400,
  },
  {
    id: 'duelist',
    title: 'Duelo en Gravedad Cero',
    description: 'Consigue la victoria en una partida multijugador local frente a tu compañero.',
    icon: 'swords',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 250,
  },
  {
    id: 'combo_master',
    title: 'Ráfaga de Pulso',
    description: 'Encadena 3 o más parejas correctas consecutivas sin fallar en una partida.',
    icon: 'sparkles',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    xpReward: 250,
  },
  {
    id: 'galactic_ace',
    title: 'Archivero Cósmico',
    description: 'Encuentra 50 parejas de cartas espaciales a lo largo de tus partidas.',
    icon: 'award',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    xpReward: 500,
  },
  {
    id: 'streak_master',
    title: 'Racha Estelar',
    description: 'Alcanza una racha de 3 victorias consecutivas en solitario.',
    icon: 'flame',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    xpReward: 450,
  },
  {
    id: 'sector_1_master',
    title: 'As del Sistema Solar',
    description: 'Consigue las 12 estrellas totales en el Sector 1 del mapa galáctico.',
    icon: 'star',
    unlocked: false,
    progress: 0,
    maxProgress: 12,
    xpReward: 600,
  },
];

export function calculatePilotRank(xp: number): { title: string; level: number; nextLevelXp: number; currentLevelXp: number } {
  const ranks = [
    { level: 1, title: 'Cadete Espacial', minXp: 0 },
    { level: 2, title: 'Oficial de Navegación', minXp: 400 },
    { level: 3, title: 'Piloto Estelar', minXp: 1200 },
    { level: 4, title: 'Comandante de Flota', minXp: 2500 },
    { level: 5, title: 'Almirante Galáctico', minXp: 4500 },
  ];

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (xp >= ranks[i].minXp) {
      const current = ranks[i];
      const next = ranks[i + 1];
      return {
        title: current.title,
        level: current.level,
        currentLevelXp: current.minXp,
        nextLevelXp: next ? next.minXp : current.minXp + 2500,
      };
    }
  }

  return { title: 'Cadete Espacial', level: 1, currentLevelXp: 0, nextLevelXp: 400 };
}
