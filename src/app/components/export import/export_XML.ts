import { LineShape } from '../../models/concreteClasses/line-shape';
import { RectangleShape } from '../../models/concreteClasses/rectangle-shape';
import { SquareShape } from '../../models/concreteClasses/square-shape';
import { EllipseShape } from '../../models/concreteClasses/ellipse-shape';
import { CircleShape } from '../../models/concreteClasses/circle-shape';
import { ShapeStyles } from '../../models/dtos/shape.dto';
import { BaseShape } from '../../models/concreteClasses/base-shape';
import { PolygonShape } from '../../models/concreteClasses/polygon-shape';
// Deprecated export file for exporting shapes to XML
export class ExportXML {
    export(shapes: BaseShape[]) {
        let svgShapes = shapes.map(shape => shape.getXML());
        return `<?xml version="1.0" encoding="ISO-8859-1"?>\n<shapes>\n${svgShapes.join("\n")}\n</shapes>`
    }
}