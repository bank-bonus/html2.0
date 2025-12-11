export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE'
}

export interface GameState {
  code: string | null;
  fileName: string;
  history: string[]; // Для возможности отмены (в будущем)
}

export interface AiResponse {
  success: boolean;
  code?: string;
  error?: string;
}