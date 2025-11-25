import {EllipseDto} from '../dtos/ellipse.dto';
import {BaseShape} from './base-shape';
import {ShapeDto} from '../dtos/shape.dto';

// Deprecated classes don't use them 
// They are kept for backward compatibility
// and may be removed in future versions
// Use Konva shapes instead
// They introduced initialy for svg but currently 
// Konva is used for rendering shapes

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
    return `<ellipse id="${this.id}" cx=${this.cx} cy=${this.cy} rx=${this.rx} ry=${this.ry} ${this.stylesToAttribute()} />`
  }

  override containsPoint(pointX:number, pointY:number): boolean {
    if (this.cx === undefined || this.cy === undefined || this.rx === undefined || this.ry === undefined) {
      return false;
    }

    const normalizedX = (pointX - this.cx) / this.rx;
    const normalizedY = (pointY - this.cy) / this.ry;

    return (normalizedX ** 2 + normalizedY ** 2) <= 1;
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
