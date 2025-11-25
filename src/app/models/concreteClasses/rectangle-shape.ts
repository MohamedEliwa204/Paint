import {BaseShape} from './base-shape';
import {RectangleDto} from '../dtos/rectangle.dto';


// Deprecated classes don't use them 
// They are kept for backward compatibility
// and may be removed in future versions
// Use Konva shapes instead
// They introduced initialy for svg but currently 
// Konva is used for rendering shapes
export class RectangleShape extends BaseShape {
  override type: string;
  rx?: number;
  ry?: number;

  constructor(dto: RectangleDto) {
    super(dto);
    this.type = dto.type || 'rectangle';
    this.rx = dto.rx;
    this.ry = dto.ry;
  }

  applyPositionToElement(el: SVGGraphicsElement): void {
    if (el.tagName.toLowerCase() === 'rect') {
      el.setAttribute('x', this.x.toString());
      el.setAttribute('y', this.y.toString());
      el.setAttribute('width', this.width.toString());
      el.setAttribute('height', this.height.toString());
      if (this.rx !== undefined) el.setAttribute('rx', this.rx.toString());
      if (this.ry !== undefined) el.setAttribute('ry', this.ry.toString());
    }
  }

  containsPoint(): boolean {
    return false;
  }

  override getSVG() {
    return `<rect id="${this.id}" x=${this.x} y=${this.y} width=${this.width} height=${this.height} ${this.stylesToAttribute()} />`
  }

  override getXML() {
    return this.getSVG();
  }

  override getProps(): RectangleDto {
    return {
      id: this.id,
      type: 'rectangle',
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rx: this.rx,
      ry: this.ry,
      shapeStyles: this.shapeStyles
    }
  }




}
