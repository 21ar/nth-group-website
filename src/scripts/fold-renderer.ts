export interface FoldFrame { progress: number; weights:number[]; pointerX: number; pointerY: number; }
export interface FoldRenderer { draw(frame: FoldFrame): void; resize(): void; dispose(): void; }
