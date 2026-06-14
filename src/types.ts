export interface PitchLog {
  id: string;
  date: string;
  pitchesCount: number;
  topSpeedMph?: number;
  caughtSameDay: boolean;
  notes?: string;
  clearedDate: string;
  requiredRestDays: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'warmup' | 'agility' | 'strength' | 'core' | 'cooldown';
  baseReps: string;
  phaseSpecs: {
    [phase: number]: string; // instruction for that phase
  };
  description: string;
  cues: string[];
  visualType?: 'squat' | 'pushup' | 'row' | 'bridge' | 'lunge' | 'carry' | 'balance' | 'warmup' | 'agility' | 'core' | 'stretch';
  videoLink?: string;
}

export interface BlockPlan {
  name: string;
  time: string;
  focus: string;
  category: 'warmup' | 'agility' | 'strength' | 'core' | 'cooldown';
  exercises: string[]; // exercise ids
}

export interface DayPlan {
  dayId: number; // 1, 2, 3 (Strength days) or 101, 102 (Throwing Days A, B)
  name: string;
  subtitle: string;
  description: string;
  tipTitle?: string;
  tipDescription?: string;
  blocks: BlockPlan[];
}

export interface ProgramPhase {
  phaseId: number;
  weeks: number[];
  name: string;
  description: string;
  strengthRounds: number;
  circuitRepGuidelines: {
    [exerciseId: string]: string;
  };
}

export interface DailyWorkoutProgress {
  id: string; // "week-W-day-D" or "YYYY-MM-DD"
  date: string;
  week: number;
  dayId: number;
  completedExercises: string[]; // exercise IDs
  wellBeing: number; // 1-5 rating (5 is excellent, 1 is very sore/tired)
  completed: boolean;
}

export interface ArmCareProgress {
  date: string; // YYYY-MM-DD
  completedSteps: number[]; // indexes 0-5
}
