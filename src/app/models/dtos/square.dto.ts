
import { ShapeDto } from './shape.dto';

export interface SquareDto extends ShapeDto {
  type: 'square';

  side?: number;
}
