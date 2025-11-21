
import {EllipseDto} from '../dtos/ellipse.dto';
import {BaseShape} from './base-shape';

export class EllipseShape extends BaseShape implements EllipseDto{
  override type: 'ellipse' = 'ellipse';
  rx?: number;
  ry?: number;


  constructor(dto:EllipseDto) {
    super(dto);
    this.rx = dto.rx;
    this.ry = dto.ry;
  }

  applyPositionToElement(el: SVGGraphicsElement): void {
  }

  toSVG(): string {
    return '';
  }
}
