import { ShapeDto } from './shape.dto';

export interface EllipseDto extends ShapeDto {
  type: 'ellipse';
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}
