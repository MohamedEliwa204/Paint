import { Line } from '../../models/Line';
import { Rectangle } from '../../models/Rectangle';
import { Square } from '../../models/Square';
import { Ellipse } from '../../models/Ellipse';
import { Circle } from '../../models/Cirlce';
import { Polygon } from '../../models/Polygon';
import { Shape, ShapeStyles } from '../../models/Shape';
import { ShapeJSON } from '../../models/Shape';
export class ImportJson {
    import(shapesJson: string) {
        let shapesArray: ShapeJSON[] = JSON.parse(shapesJson);
        return shapesArray.map(shape => this.createShape(shape));
    }

    private createShape(shape: ShapeJSON): Shape {
        switch (shape.type) {
            case 'line':
                return new Line(
                    shape.id,
                    shape.x1 ?? 0,
                    shape.y1 ?? 0,
                    shape.x2 ?? 0,
                    shape.y2 ?? 0,
                    shape.shapeStyles
                );
            case 'rect':
                return new Rectangle(
                    shape.id,
                    shape.x ?? 0,
                    shape.y ?? 0,
                    shape.width ?? 0,
                    shape.height ?? 0,
                    shape.shapeStyles
                );
            case 'square':
                return new Square(
                    shape.id,
                    shape.x ?? 0,
                    shape.y ?? 0,
                    shape.width ?? 0,
                    shape.shapeStyles
                );
            case 'ellipse':
                return new Ellipse(
                    shape.id,
                    shape.cx ?? 0,
                    shape.cy ?? 0,
                    shape.rx ?? 0,
                    shape.ry ?? 0,
                    shape.shapeStyles
                );
            case 'circle':
                return new Circle(
                    shape.id,
                    shape.cx ?? 0,
                    shape.cy ?? 0,
                    shape.r ?? 0,
                    shape.shapeStyles
                );

            case 'polygon':
                return new Polygon(
                    shape.id,
                    shape.points ?? [],
                    shape.shapeStyles
                );
            default:
                throw new Error(`Unknown shape type: ${shape.type}`);
        }
    }



}