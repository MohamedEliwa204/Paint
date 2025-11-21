import {RectangleShape} from './rectangle-shape';
import {SquareDto} from '../dtos/square.dto';


export class SquareShape extends RectangleShape implements SquareDto {
  override type = 'square' as const;
  side?: number;

  constructor(dto: SquareDto) {
    super({
      ...dto,
      type: 'square',
      width: dto.side ?? dto.width ?? 0,
      height: dto.side ?? dto.height ?? 0
    });

    this.side = dto.side;
  }

  override getProps(): SquareDto {
    return {
      id: this.id,
      type: 'square',
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      side: this.side,
      shapeStyles: this.shapeStyles
    };
  }
}
