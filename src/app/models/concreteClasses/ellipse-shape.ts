
import {EllipseDto} from '../dtos/ellipse.dto';
import {BaseShape} from './base-shape';

export class EllipseShape extends BaseShape implements EllipseDto{
  override type: 'ellipse' = 'ellipse';
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;


  constructor(dto:EllipseDto) {
    super(dto);
    this.rx = dto.rx;
    this.ry = dto.ry;
  }

  override applyPositionToElement(el: SVGGraphicsElement): void {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    el.setAttribute('cx', cx.toString());
    el.setAttribute('cy', cy.toString());
  }



  toSVG(): string {
    return '';
  }

  containsPoint(): boolean {
    return false;
  }
}
