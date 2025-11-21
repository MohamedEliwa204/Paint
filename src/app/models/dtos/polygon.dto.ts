
import { ShapeDto } from './shape.dto';

export interface PolygonDto extends ShapeDto {
  type: 'polygon';

  points?: { x: number; y: number }[];
}
