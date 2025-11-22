import { LineShape } from '../../models/concreteClasses/line-shape';
import { RectangleShape } from '../../models/concreteClasses/rectangle-shape';
import { SquareShape } from '../../models/concreteClasses/square-shape';
import { EllipseShape } from '../../models/concreteClasses/ellipse-shape';
import { CircleShape } from '../../models/concreteClasses/circle-shape';
import { ShapeStyles } from '../../models/dtos/shape.dto';
import { BaseShape } from '../../models/concreteClasses/base-shape';
import { PolygonShape } from '../../models/concreteClasses/polygon-shape';
export class ImportJson {
    import(shapesJson: string) {
        let shapesArray: any[] = JSON.parse(shapesJson);
        return shapesArray.map(shape => this.createShape(shape));
    }

    private createShape(shape: any): BaseShape {
        switch (shape.type) {
            case 'line':
                return new LineShape({
                    id: shape.id,
                    type: 'line',
                    x1: shape.x1 ?? 0,
                    y1: shape.y1 ?? 0,
                    x2: shape.x2 ?? 0,
                    y2: shape.y2 ?? 0,
                    shapeStyles: shape.shapeStyles
                });
            case 'rect':
                return new RectangleShape({
                    id: shape.id,
                    type: 'rectangle',
                    x: shape.x ?? 0,
                    y: shape.y ?? 0,
                    width: shape.width ?? 0,
                    height: shape.height ?? 0,
                    shapeStyles: shape.shapeStyles
                });
            case 'square':
                return new SquareShape({
                    id: shape.id,
                    type: 'square',
                    x: shape.x ?? 0,
                    y: shape.y ?? 0,
                    width: shape.width ?? 0,
                    height: shape.height ?? 0,
                    shapeStyles: shape.shapeStyles
                });
            case 'ellipse':
                return new EllipseShape({
                    id: shape.id,
                    type: 'ellipse',
                    cx: shape.cx ?? 0,
                    cy: shape.cy ?? 0,
                    rx: shape.rx ?? 0,
                    ry: shape.ry ?? 0,
                    shapeStyles: shape.shapeStyles
                });
            case 'circle':
                return new CircleShape({
                    id: shape.id,
                    type: 'circle',
                    cx: shape.cx ?? 0,
                    cy: shape.cy ?? 0,
                    r: shape.r ?? 0,
                    shapeStyles: shape.shapeStyles
                });

            case 'polygon':
                return new PolygonShape({
                    id: shape.id,
                    type: 'polygon',
                    points: shape.points ?? [],
                    shapeStyles: shape.shapeStyles
                });
            default:
                throw new Error(`Unknown shape type: ${shape.type}`);
        }
    }



}