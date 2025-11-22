export type ShapeType = 'rect' | 'ellipse' | 'svg' | 'polygon' | 'line' | 'square' |'circle';
export type ShapeStyles = {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  opacity?: number,
  strokeDashArray?: string,
  strokeLinecap?: 'butt' | 'round' | 'square';
  [key: string]: any
}
export interface ShapeDto {
  id: string;
  type: string;
  shapeStyles: ShapeStyles;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number; // degrees
  isSelected?: boolean;
  metadata?: Record<string, unknown>;
}
