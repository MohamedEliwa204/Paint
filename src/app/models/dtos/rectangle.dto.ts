import { ShapeDto } from './shape.dto';

export interface RectangleDto extends ShapeDto {
  rx?: number;
  ry?: number;
}
