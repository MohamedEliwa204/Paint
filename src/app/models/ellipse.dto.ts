import { ShapeDto } from './shape.dto';

export interface EllipseDto extends ShapeDto {
  type: 'ellipse';
  rx?: number;
  ry?: number;
}
