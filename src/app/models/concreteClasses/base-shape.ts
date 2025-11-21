import {ShapeDto, ShapeType} from '../dtos/shape.dto';
import {ShapeJSON, ShapeStyles} from '../Shape';

export abstract class BaseShape implements ShapeDto {

  id: string;
  type: string;


  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number; // degrees

  shapeStyles: ShapeStyles;

  isSelected?: boolean;
  metadata?: Record<string, unknown>;
  protected _dragOffset?: { x: number; y: number }; // because i use it in all children classes

  protected constructor(dto: ShapeDto) {

    this.id = dto.id;
    this.type = dto.type;
    this.x = dto.x ?? 0;
    this.y = dto.y ?? 0;
    this.width = dto.width ?? 0;
    this.height = dto.height ?? 0;
    this.rotation = dto.rotation;

    this.shapeStyles = dto.shapeStyles ?? ({} as ShapeStyles);


    this.isSelected = dto.isSelected;
    this.metadata = dto.metadata;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  resize(dw: number, dh: number) {
    this.width = Math.max(0, this.width + dw);
    this.height = Math.max(0, this.height + dh);
  }

  startDrag(poniterX: number, pointerY: number) {
    this._dragOffset = {x: poniterX - this.x, y: pointerY - this.y};
  }

  dragTo(pointerX: number, pointerY: number) {
    if (!this._dragOffset){
      return
    }
    this.x = pointerX - this._dragOffset.x;
    this.y = pointerY - this._dragOffset.y;
  }

  endDrag() {
    this._dragOffset = undefined;
  }
  protected stylesToAttribute() {
    return Object.entries(this.shapeStyles).map(([key, value]) => `${this.toKebabCase(key)}="${value}"`).join(" ");
  }
  protected toKebabCase(str: string) {
    return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
  }
  abstract applyPositionToElement(el: SVGGraphicsElement): void;

  abstract getSVG(): string;
  abstract getProps(): ShapeDto;
  abstract getXML(): string;

  abstract containsPoint(): boolean;


}
