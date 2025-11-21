
import { ShapeDto } from './shape.dto';

export interface CircleDto extends ShapeDto {
  type: 'circle';

  cx?: number;
  cy?: number;
  r?: number;
}
