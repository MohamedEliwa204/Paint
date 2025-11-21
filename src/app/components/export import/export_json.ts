import { Shape } from '../../models/Shape';
export class ExportJson {
    export(shapes: Shape[]) {
        let jsonShapes = JSON.stringify(shapes.map(shape => shape.getProps()));
        return jsonShapes;
    }
}