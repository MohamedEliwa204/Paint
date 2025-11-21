
import { RectangleDto } from './rectangle.dto';

export interface SquareDto extends RectangleDto {
  type: 'square';

  side?: number;
}
