
import { ShapeDto } from './shape.dto';

export interface LineDto extends ShapeDto {
  type: 'line' | 'free-draw';
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  strokeLinecap?: 'butt' | 'round' | 'square';
}
