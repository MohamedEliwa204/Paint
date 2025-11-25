import {EllipseShape} from './ellipse-shape';
import {CircleDto} from '../dtos/circle.dto';

// Deprecated classes don't use them 
// They are kept for backward compatibility
// and may be removed in future versions
// Use Konva shapes instead
// They introduced initialy for svg but currently 
// Konva is used for rendering shapes

export class CircleShape extends EllipseShape<CircleDto> implements CircleDto{
  override type = 'circle' as const;
  r?: number;

  constructor(dto: CircleDto) {
    super({
      ...dto,
      type: 'ellipse',
      rx: dto.r,
      ry: dto.r
    });

    (this as any).type = 'circle';
    this.cx = dto.cx;
    this.cy = dto.cy;
    this.r = dto.r;

  }

  override getProps(): CircleDto {
    return {
      height: this.height,
      width: this.width,
      x: this.x,
      y: this.y,
      id: this.id,
      type: 'circle',
      cx: this.cx,
      cy: this.cy,
      r: this.r!,
      shapeStyles: this.shapeStyles
    };
  }

  override getXML(): string {
    return this.getSVG();
  }

  override getSVG(): string {
    return `<circle id="${this.id}" cx=${this.cx} cy=${this.cy} r=${this.r} ${this.stylesToAttribute()} />`;
  }
}

