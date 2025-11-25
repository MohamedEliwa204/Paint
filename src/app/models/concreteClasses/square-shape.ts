import { RectangleShape } from './rectangle-shape';
import { SquareDto } from '../dtos/square.dto';


// Deprecated classes don't use them 
// They are kept for backward compatibility
// and may be removed in future versions
// Use Konva shapes instead
// They introduced initialy for svg but currently 
// Konva is used for rendering shapes
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

  override getSVG(): string {
    return `<rect id="${this.id}" x=${this.x} y=${this.y} width=${this.width} height=${this.height} ${this.stylesToAttribute()} />`;
  }
  override getXML(): string {
    return `<square id="${this.id}" x=${this.x} y=${this.y} width=${this.width} height=${this.height} ${this.stylesToAttribute()} />`;
  }
}
