
import { ShapeDto } from './shape.dto';

export interface TriangleDto extends ShapeDto {
  type: 'triangle';

  points?: { x: number; y: number }[];
}
