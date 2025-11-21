import {BaseShape} from './base-shape';
import {PolygonDto} from '../dtos/polygon.dto';


export class PolygonShape extends BaseShape implements PolygonDto {
  override type = 'polygon' as const;
  points: { x: number, y: number }[];

  constructor(dto: PolygonDto) {
    super(dto);
    this.points = dto.points ?? [];
  }

  applyPositionToElement(el: SVGGraphicsElement): void {
    if (el.tagName.toLowerCase() === 'polygon') {
      const pointsAttr = this.points.map(p => `${p.x},${p.y}`).join(" ");
      el.setAttribute('points', pointsAttr);
    }
  }

  containsPoint(): boolean {
    return false;
  }

  override getSVG(): string {
    const pointsAttr = this.points.map(p => `${p.x},${p.y}`).join(" ");
    return `<polygon id=${this.id} points="${pointsAttr}" ${this.stylesToAttribute()} />`;
  }

  override getXML(): string {
    return this.getSVG();
  }

  override getProps(): PolygonDto {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      points: this.points,
      shapeStyles: this.shapeStyles
    };
  }
}
