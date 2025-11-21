import { ShapeDto } from './shape.dto';

export interface RectangleDto extends ShapeDto {
  type: 'rectangle';
  rx?: number;
  ry?: number;
}
