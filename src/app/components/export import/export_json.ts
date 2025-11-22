import { LineShape } from '../../models/concreteClasses/line-shape';
import { RectangleShape } from '../../models/concreteClasses/rectangle-shape';
import { SquareShape } from '../../models/concreteClasses/square-shape';
import { EllipseShape } from '../../models/concreteClasses/ellipse-shape';
import { CircleShape } from '../../models/concreteClasses/circle-shape';
import { ShapeStyles } from '../../models/dtos/shape.dto';
import { BaseShape } from '../../models/concreteClasses/base-shape';
import { PolygonShape } from '../../models/concreteClasses/polygon-shape';export class ExportJson {
    export(shapes: BaseShape[]) {
        let jsonShapes = JSON.stringify(shapes.map(shape => shape.getProps()));
        return jsonShapes;
    }
}