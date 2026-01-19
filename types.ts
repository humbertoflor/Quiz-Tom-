
export enum StepType {
  INTRO = 'INTRO',
  QUESTION = 'QUESTION',
  TRANSITION = 'TRANSITION',
  DATE_INPUT = 'DATE_INPUT',
  LOADING_ANALYSIS = 'LOADING_ANALYSIS',
  PRE_REVELATION = 'PRE_REVELATION'
}

export interface Option {
  id: string;
  label: string;
  icon?: string;
}

export interface QuizStep {
  id: number;
  type: StepType;
  title?: string;
  subtitle?: string;
  text?: string;
  question?: string;
  options?: Option[];
  multiple?: boolean;
  maxSelections?: number;
  buttonLabel?: string;
}

export interface QuizState {
  currentStepIndex: number;
  answers: Record<number, string | string[]>;
  birthDate: string;
}
