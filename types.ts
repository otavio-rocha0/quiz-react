export interface Character {
  base: string;
  accessory: string | null;
}

export type GameState = 'HOME' | 'JOIN_ROOM' | 'SETUP' | 'LOBBY' | 'QUESTION' | 'LEADERBOARD' | 'PODIUM';

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  question: string;
  answers: Answer[];
  timeLimit: number;
}

export interface Player {
  name: string;
  score: number;
  character: Character;
}

export type AccessoryPosition = 'head' | 'eyes' | 'face' | 'overlay';