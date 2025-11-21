import { Line } from '../../models/Line';
import { Rectangle } from '../../models/Rectangle';
import { Square } from '../../models/Square';
import { Ellipse } from '../../models/Ellipse';
import { Circle } from '../../models/Cirlce';
import { Polygon } from '../../models/Polygon';
import { Shape, ShapeStyles } from '../../models/Shape';
export class ExportXML {
    export(shapes: Shape[]) {
        let svgShapes = shapes.map(shape => shape.getXML());
        return `<?xml version="1.0" encoding="ISO-8859-1"?>\n<shapes>\n${svgShapes.join("\n")}\n</shapes>`
    }
}