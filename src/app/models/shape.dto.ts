export type ShapeType = 'rectangle' | 'ellipse' | 'svg' | 'triangle' | 'line' | 'square' |'circle';

export interface ShapeDto {
  id: string;
  type: ShapeType;


  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number; // degrees

  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';

  isSelected?: boolean;
  metadata?: Record<string, unknown>;
}
