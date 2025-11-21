
import {ShapeDto, ShapeType} from '../dtos/shape.dto';
export abstract class BaseShape implements ShapeDto{

  id: string;
  type: ShapeType;


  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number; // degrees

  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';

  isSelected?: boolean;
  metadata?: Record<string, unknown>;

  constructor(dto: ShapeDto) {

    this.id = dto.id;
    this.type = dto.type;
    this.x = dto.x ?? 0;
    this.y = dto.y ?? 0;
    this.width = dto.width ?? 0;
    this.height = dto.height ?? 0;
    this.rotation = dto.rotation;

    this.fill = dto.fill;
    this.stroke = dto.stroke;
    this.strokeWidth = dto.strokeWidth;
    this.opacity = dto.opacity;
    this.strokeDasharray = dto.strokeDasharray;
    this.strokeLinecap = dto.strokeLinecap;

    this.isSelected = dto.isSelected;
    this.metadata = dto.metadata;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  resize(dw: number, dh:number){
    this.width = Math.max(0, this.width + dw);
    this.height = Math.max(0, this.height + dh);
  }

  startDrag(poniterX:number, pointerY:number){}
  dragTo(poniterX:number, pointerY:number){}
  endDrag(){}
  abstract applyPositionToElement(el: SVGGraphicsElement):void;
  abstract toSVG():string;
  abstract containsPoint():boolean;


}
