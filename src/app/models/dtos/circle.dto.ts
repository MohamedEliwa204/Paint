
import { EllipseDto } from './ellipse.dto';

export interface CircleDto extends EllipseDto {
  type: 'circle';
  r?: number;
}
