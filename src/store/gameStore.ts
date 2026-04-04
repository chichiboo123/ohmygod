import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Types
export type Theme = 'default' | 'forest' | 'space' | 'city' | 'ocean' | 'desert';
export type GameOverCondition = 'timeLimit' | 'maxLaps' | 'targetCurrency' | 'survival';

export interface GameSettings {
  title: string;
  theme: Theme;
  boardSize: number;
  currency: string;
  players: number;
  lapReward: number;
  diceCount: 1 | 2;
  diceFaces: number;
  gameOverCondition: GameOverCondition;
  conditionValue: number;
  multiplierRatio: number;
}

export interface Tile {
  id: string;
  name: string;
  isFixed: boolean;
  tier1: number;
  tier2: number;
  fullControl: number;
  owner: number | null;
  ownerTier: number;
}

export interface EventCard {
  id: string;
  title: string;
  mission: string;
  value: number;
  emoji: string;
  color: string;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  score: number;
  position: number;
  laps: number;
  isEliminated: boolean;
}

export interface PlayState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  currentPlayerIndex: number;
  players: Player[];
  diceResult: number[];
  isAutoMode: boolean;
  timeRemaining: number;
  lastEventCard: EventCard | null;
  winner: Player | null;
}

const PLAYER_COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#84cc16',
];

const defaultSettings: GameSettings = {
  title: '',
  theme: 'default',
  boardSize: 20,
  currency: '돈',
  players: 4,
  lapReward: 200,
  diceCount: 1,
  diceFaces: 6,
  gameOverCondition: 'maxLaps',
  conditionValue: 5,
  multiplierRatio: 1.5,
};

function calcTier2(tier1: number, ratio: number): number {
  return Math.round(tier1 * ratio / 10) * 10;
}

function calcFullControl(tier1: number, ratio: number): number {
  const tier2 = calcTier2(tier1, ratio);
  return Math.round(tier2 * ratio / 10) * 10;
}

function generateDefaultTiles(size: number, ratio: number): Tile[] {
  const tiles: Tile[] = [];
  for (let i = 0; i < size; i++) {
    const isStart = i === 0;
    const tier1 = isStart ? 0 : Math.round((50 + i * 20) / 10) * 10;
    tiles.push({
      id: uuidv4(),
      name: isStart ? '출발' : `타일 #${i + 1}`,
      isFixed: isStart,
      tier1,
      tier2: calcTier2(tier1, ratio),
      fullControl: calcFullControl(tier1, ratio),
      owner: null,
      ownerTier: 0,
    });
  }
  return tiles;
}

function createPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Player ${i + 1}`,
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    score: 1000,
    position: 0,
    laps: 0,
    isEliminated: false,
  }));
}

interface GameStore {
  // State
  settings: GameSettings;
  tiles: Tile[];
  cards: EventCard[];
  playState: PlayState;
  activeTab: string;

  // Settings actions
  updateSettings: (partial: Partial<GameSettings>) => void;

  // Tile actions
  setTiles: (tiles: Tile[]) => void;
  updateTile: (id: string, partial: Partial<Tile>) => void;
  addTile: () => void;
  removeTile: (id: string) => void;
  shuffleTiles: () => void;
  regenerateTiles: () => void;
  recalcAllTiers: () => void;

  // Card actions
  addCard: () => void;
  updateCard: (id: string, partial: Partial<EventCard>) => void;
  removeCard: (id: string) => void;

  // Play actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  rollDice: () => void;
  movePlayer: (steps: number) => void;
  drawEventCard: () => void;
  toggleAutoMode: () => void;
  tickTimer: () => void;
  setActiveTab: (tab: string) => void;

  // Export/Import
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
  getShareableState: () => object;
  loadFromShareable: (data: unknown) => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  settings: defaultSettings,
  tiles: generateDefaultTiles(defaultSettings.boardSize, defaultSettings.multiplierRatio),
  cards: [],
  playState: {
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    currentPlayerIndex: 0,
    players: [],
    diceResult: [],
    isAutoMode: true,
    timeRemaining: 0,
    lastEventCard: null,
    winner: null,
  },
  activeTab: 'settings',

  updateSettings: (partial) => {
    set((state) => {
      const newSettings = { ...state.settings, ...partial };
      let newTiles = state.tiles;

      // Regenerate tiles if board size changed
      if (partial.boardSize !== undefined && partial.boardSize !== state.settings.boardSize) {
        newTiles = generateDefaultTiles(partial.boardSize, newSettings.multiplierRatio);
      }

      // Recalculate tiers if multiplier changed
      if (partial.multiplierRatio !== undefined && partial.multiplierRatio !== state.settings.multiplierRatio) {
        newTiles = newTiles.map((t) => ({
          ...t,
          tier2: calcTier2(t.tier1, partial.multiplierRatio!),
          fullControl: calcFullControl(t.tier1, partial.multiplierRatio!),
        }));
      }

      return { settings: newSettings, tiles: newTiles };
    });
  },

  setTiles: (tiles) => set({ tiles }),

  updateTile: (id, partial) => {
    set((state) => {
      const ratio = state.settings.multiplierRatio;
      return {
        tiles: state.tiles.map((t) => {
          if (t.id !== id) return t;
          const updated = { ...t, ...partial };
          if (partial.tier1 !== undefined) {
            updated.tier2 = calcTier2(updated.tier1, ratio);
            updated.fullControl = calcFullControl(updated.tier1, ratio);
          }
          return updated;
        }),
      };
    });
  },

  addTile: () => {
    set((state) => {
      const idx = state.tiles.length;
      const tier1 = Math.round((50 + idx * 20) / 10) * 10;
      const ratio = state.settings.multiplierRatio;
      return {
        tiles: [
          ...state.tiles,
          {
            id: uuidv4(),
            name: `타일 #${idx + 1}`,
            isFixed: false,
            tier1,
            tier2: calcTier2(tier1, ratio),
            fullControl: calcFullControl(tier1, ratio),
            owner: null,
            ownerTier: 0,
          },
        ],
        settings: { ...state.settings, boardSize: state.tiles.length + 1 },
      };
    });
  },

  removeTile: (id) => {
    set((state) => ({
      tiles: state.tiles.filter((t) => t.id !== id),
      settings: { ...state.settings, boardSize: state.tiles.length - 1 },
    }));
  },

  shuffleTiles: () => {
    set((state) => {
      const fixed = state.tiles.filter((t) => t.isFixed);
      const movable = state.tiles.filter((t) => !t.isFixed);

      // Fisher-Yates shuffle on movable tiles
      for (let i = movable.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movable[i], movable[j]] = [movable[j], movable[i]];
      }

      // Rebuild array preserving fixed tile positions
      const result: Tile[] = [];
      let mIdx = 0;
      for (let i = 0; i < state.tiles.length; i++) {
        const orig = state.tiles[i];
        if (orig.isFixed) {
          result.push(orig);
        } else {
          result.push(movable[mIdx++]);
        }
      }

      return { tiles: result };
    });
  },

  regenerateTiles: () => {
    set((state) => ({
      tiles: generateDefaultTiles(state.settings.boardSize, state.settings.multiplierRatio),
    }));
  },

  recalcAllTiers: () => {
    set((state) => ({
      tiles: state.tiles.map((t) => ({
        ...t,
        tier2: calcTier2(t.tier1, state.settings.multiplierRatio),
        fullControl: calcFullControl(t.tier1, state.settings.multiplierRatio),
      })),
    }));
  },

  addCard: () => {
    set((state) => ({
      cards: [
        ...state.cards,
        {
          id: uuidv4(),
          title: '',
          mission: '',
          value: 0,
          emoji: '🎲',
          color: '#6366f1',
        },
      ],
    }));
  },

  updateCard: (id, partial) => {
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    }));
  },

  removeCard: (id) => {
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== id),
    }));
  },

  startGame: () => {
    const { settings, tiles } = get();
    if (tiles.length === 0) return;

    const players = createPlayers(settings.players);
    set({
      playState: {
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        currentPlayerIndex: 0,
        players,
        diceResult: [],
        isAutoMode: true,
        timeRemaining: settings.gameOverCondition === 'timeLimit' ? settings.conditionValue : 0,
        lastEventCard: null,
        winner: null,
      },
      // Reset tile ownership
      tiles: tiles.map((t) => ({ ...t, owner: null, ownerTier: 0 })),
    });
  },

  pauseGame: () => {
    set((state) => ({
      playState: { ...state.playState, isPaused: true },
    }));
  },

  resumeGame: () => {
    set((state) => ({
      playState: { ...state.playState, isPaused: false },
    }));
  },

  resetGame: () => {
    set((state) => ({
      playState: {
        isPlaying: false,
        isPaused: false,
        isGameOver: false,
        currentPlayerIndex: 0,
        players: [],
        diceResult: [],
        isAutoMode: true,
        timeRemaining: 0,
        lastEventCard: null,
        winner: null,
      },
      tiles: state.tiles.map((t) => ({ ...t, owner: null, ownerTier: 0 })),
    }));
  },

  rollDice: () => {
    const { settings, playState, tiles } = get();
    if (!playState.isPlaying || playState.isPaused || playState.isGameOver) return;

    const results: number[] = [];
    for (let i = 0; i < settings.diceCount; i++) {
      results.push(Math.floor(Math.random() * settings.diceFaces) + 1);
    }
    const total = results.reduce((a, b) => a + b, 0);

    if (playState.isAutoMode) {
      set((state) => {
        const players = [...state.playState.players];
        const current = { ...players[state.playState.currentPlayerIndex] };

        if (current.isEliminated) {
          // Skip eliminated players
          const nextIdx = findNextPlayer(players, state.playState.currentPlayerIndex);
          return {
            playState: {
              ...state.playState,
              diceResult: results,
              currentPlayerIndex: nextIdx,
            },
          };
        }

        const boardSize = state.tiles.length;
        const oldPos = current.position;
        const newPos = (oldPos + total) % boardSize;

        // Check if passed start
        if (oldPos + total >= boardSize) {
          current.laps += 1;
          current.score += state.settings.lapReward;
        }

        current.position = newPos;

        // Land on tile - pay cost or collect from owned
        const tile = tiles[newPos];
        if (tile && tile.tier1 > 0) {
          if (tile.owner !== null && tile.owner !== current.id) {
            // Pay rent to owner
            const rent = tile.ownerTier === 3 ? tile.fullControl : tile.ownerTier === 2 ? tile.tier2 : tile.tier1;
            current.score -= rent;
            const ownerIdx = players.findIndex((p) => p.id === tile.owner);
            if (ownerIdx >= 0) {
              players[ownerIdx] = { ...players[ownerIdx], score: players[ownerIdx].score + rent };
            }
          } else if (tile.owner === null) {
            // Buy tile
            if (current.score >= tile.tier1) {
              current.score -= tile.tier1;
              const newTiles = [...state.tiles];
              newTiles[newPos] = { ...newTiles[newPos], owner: current.id, ownerTier: 1 };
              players[state.playState.currentPlayerIndex] = current;
              const nextIdx = findNextPlayer(players, state.playState.currentPlayerIndex);
              const gameOverCheck = checkGameOver(state.settings, players, state.playState);
              return {
                tiles: newTiles,
                playState: {
                  ...state.playState,
                  diceResult: results,
                  players,
                  currentPlayerIndex: nextIdx,
                  ...gameOverCheck,
                },
              };
            }
          }
        }

        // Survival check
        if (current.score <= 0 && state.settings.gameOverCondition === 'survival') {
          current.isEliminated = true;
        }

        players[state.playState.currentPlayerIndex] = current;
        const nextIdx = findNextPlayer(players, state.playState.currentPlayerIndex);
        const gameOverCheck = checkGameOver(state.settings, players, state.playState);

        return {
          playState: {
            ...state.playState,
            diceResult: results,
            players,
            currentPlayerIndex: nextIdx,
            ...gameOverCheck,
          },
        };
      });
    } else {
      // Manual mode: just show dice result
      set((state) => ({
        playState: { ...state.playState, diceResult: results },
      }));
    }
  },

  movePlayer: (steps) => {
    set((state) => {
      const players = [...state.playState.players];
      const current = { ...players[state.playState.currentPlayerIndex] };
      const boardSize = state.tiles.length;
      const oldPos = current.position;
      let newPos = (oldPos + steps) % boardSize;
      if (newPos < 0) newPos = boardSize + newPos;

      if (steps > 0 && oldPos + steps >= boardSize) {
        current.laps += 1;
        current.score += state.settings.lapReward;
      }

      current.position = newPos;
      players[state.playState.currentPlayerIndex] = current;
      const nextIdx = findNextPlayer(players, state.playState.currentPlayerIndex);
      const gameOverCheck = checkGameOver(state.settings, players, state.playState);

      return {
        playState: {
          ...state.playState,
          players,
          currentPlayerIndex: nextIdx,
          ...gameOverCheck,
        },
      };
    });
  },

  drawEventCard: () => {
    const { cards, playState } = get();
    if (cards.length === 0) return;

    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    set((state) => {
      const players = [...state.playState.players];
      const current = { ...players[state.playState.currentPlayerIndex] };
      current.score += randomCard.value;

      if (current.score <= 0 && state.settings.gameOverCondition === 'survival') {
        current.isEliminated = true;
      }

      players[state.playState.currentPlayerIndex] = current;

      return {
        playState: {
          ...state.playState,
          players,
          lastEventCard: randomCard,
        },
      };
    });
  },

  toggleAutoMode: () => {
    set((state) => ({
      playState: { ...state.playState, isAutoMode: !state.playState.isAutoMode },
    }));
  },

  tickTimer: () => {
    set((state) => {
      if (!state.playState.isPlaying || state.playState.isPaused) return state;
      const newTime = state.playState.timeRemaining - 1;
      if (newTime <= 0) {
        const players = state.playState.players;
        const best = [...players].sort((a, b) => b.score - a.score)[0];
        return {
          playState: {
            ...state.playState,
            timeRemaining: 0,
            isGameOver: true,
            winner: best,
          },
        };
      }
      return {
        playState: { ...state.playState, timeRemaining: newTime },
      };
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  exportJSON: () => {
    const { settings, tiles, cards } = get();
    return JSON.stringify({ settings, tiles, cards }, null, 2);
  },

  importJSON: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.settings && data.tiles) {
        set({
          settings: { ...defaultSettings, ...data.settings },
          tiles: data.tiles,
          cards: data.cards || [],
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  getShareableState: () => {
    const { settings, tiles, cards } = get();
    return { settings, tiles, cards };
  },

  loadFromShareable: (data: unknown) => {
    try {
      const d = data as { settings?: GameSettings; tiles?: Tile[]; cards?: EventCard[] };
      if (d.settings && d.tiles) {
        set({
          settings: { ...defaultSettings, ...d.settings },
          tiles: d.tiles,
          cards: d.cards || [],
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));

function findNextPlayer(players: Player[], currentIdx: number): number {
  const total = players.length;
  let next = (currentIdx + 1) % total;
  let checked = 0;
  while (players[next].isEliminated && checked < total) {
    next = (next + 1) % total;
    checked++;
  }
  return next;
}

function checkGameOver(
  settings: GameSettings,
  players: Player[],
  playState: PlayState
): Partial<PlayState> {
  const activePlayers = players.filter((p) => !p.isEliminated);

  switch (settings.gameOverCondition) {
    case 'maxLaps': {
      const reached = players.find((p) => p.laps >= settings.conditionValue);
      if (reached) {
        return { isGameOver: true, winner: reached };
      }
      break;
    }
    case 'targetCurrency': {
      const reached = players.find((p) => p.score >= settings.conditionValue);
      if (reached) {
        return { isGameOver: true, winner: reached };
      }
      break;
    }
    case 'survival': {
      if (activePlayers.length <= 1) {
        return { isGameOver: true, winner: activePlayers[0] || null };
      }
      break;
    }
    // timeLimit is handled by tickTimer
  }
  return {};
}

// Theme background configs
export const THEME_CONFIGS: Record<Theme, { bg: string; accent: string; gradient: string }> = {
  default: { bg: 'bg-slate-100', accent: '#6366f1', gradient: 'from-slate-50 to-indigo-50' },
  forest: { bg: 'bg-green-50', accent: '#16a34a', gradient: 'from-green-50 to-emerald-100' },
  space: { bg: 'bg-slate-900', accent: '#8b5cf6', gradient: 'from-slate-900 to-purple-900' },
  city: { bg: 'bg-gray-100', accent: '#64748b', gradient: 'from-gray-100 to-blue-50' },
  ocean: { bg: 'bg-cyan-50', accent: '#0891b2', gradient: 'from-cyan-50 to-blue-100' },
  desert: { bg: 'bg-amber-50', accent: '#d97706', gradient: 'from-amber-50 to-orange-100' },
};
