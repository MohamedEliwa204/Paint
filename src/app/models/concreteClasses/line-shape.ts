import {BaseShape} from './base-shape';
import {LineDto} from '../dtos/line.dto';

export class LineShape extends BaseShape implements LineDto {
  override type = 'line' as const;
  x1: number;
  x2: number;
  y1: number;
  y2: number;

  constructor(dto: LineDto) {
    super(dto);
    this.x1 = dto.x1 ?? 0;
    this.y1 = dto.y1 ?? 0;
    this.x2 = dto.x2 ?? 0;
    this.y2 = dto.y2 ?? 0;
  }

  override getSVG(): string {
    return `<line id=${this.id} x1=${this.x1} y1=${this.y1} x2=${this.x2} y2=${this.y2} ${this.stylesToAttribute()} />`;
  }

  override getXML(): string {
    return `<line id=${this.id} x1=${this.x1} y1=${this.y1} x2=${this.x2} y2=${this.y2} ${this.stylesToAttribute()} />`;
  }

  override getProps(): LineDto {
    return {
      id: this.id,
      type: 'line',
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      shapeStyles: this.shapeStyles
    };
  }

  override applyPositionToElement(el: SVGGraphicsElement): void {
    if (el.tagName.toLowerCase() === 'line') {
      el.setAttribute('x1', this.x1.toString());
      el.setAttribute('y1', this.y1.toString());
      el.setAttribute('x2', this.x2.toString());
      el.setAttribute('y2', this.y2.toString());
    }
  }

  override containsPoint(): boolean {

    return false;
  }
}
