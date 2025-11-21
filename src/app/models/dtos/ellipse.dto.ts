import { ShapeDto } from './shape.dto';

export interface EllipseDto extends ShapeDto {
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}
