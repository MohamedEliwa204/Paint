import {EllipseDto} from '../dtos/ellipse.dto';
import {BaseShape} from './base-shape';
import {ShapeDto} from '../dtos/shape.dto';

export class EllipseShape<T extends ShapeDto = EllipseDto> extends BaseShape {
  override type: string;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;


  constructor(dto: EllipseDto) {
    super(dto);
    this.type = dto.type || 'ellipse';
    this.cx = dto.cx;
    this.cy = dto.cy;
    this.rx = dto.rx;
    this.ry = dto.ry;
  }

  override applyPositionToElement(el: SVGGraphicsElement): void {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    el.setAttribute('cx', cx.toString());
    el.setAttribute('cy', cy.toString());
  }


  override getSVG(): string {
    return `<ellipse id=${this.id} cx=${this.cx} cy=${this.cy} rx=${this.rx} ry=${this.ry} ${this.stylesToAttribute()} />`
  }

  override containsPoint(): boolean {
    return false;
  }

  getProps(): T{
    return {
      height: this.height,
      width: this.width,

      x: this.x,
      y: this.y,
      id: this.id,
      type: this.type,
      cx: this.cx,
      cy: this.cy,
      rx: this.rx,
      ry: this.ry,
      shapeStyles: this.shapeStyles
    }as unknown as T;
  }

  getXML(): string {
    return this.getSVG();
  }
}
