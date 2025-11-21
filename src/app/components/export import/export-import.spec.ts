import { Line } from '../../models/Line';
import { Rectangle } from '../../models/Rectangle';
import { Square } from '../../models/Square';
import { Ellipse } from '../../models/Ellipse';
import { Circle } from '../../models/Cirlce';
import { Polygon } from '../../models/Polygon';
import { Shape, ShapeStyles } from '../../models/Shape';
import { ExportJson } from './export_json';
import { ImportJson } from './import_json';
import { ExportXML } from './export_XML';
import { ImportXML } from './import_XML';

describe('Shape Import/Export', () => {

    let shapes: Shape[];

    beforeEach(() => {
        shapes = [
            new Line(1, 0, 0, 100, 100, { stroke: 'black', strokeWidth: 2 }),
            new Circle(4, 200, 200, 25, { fill: 'red' }),
            new Square(3, 100, 100, 50, { fill: 'green' }),
            new Rectangle(2, 10, 10, 50, 80, { fill: 'blue' }),
            new Polygon(5, [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 25, y: 50 }], { fill: 'orange' }),
        ];
    });

    it('should export and import JSON correctly', () => {
        const exportJson = new ExportJson();
        const importJson = new ImportJson();

        const jsonString = exportJson.export(shapes);
        const importedShapes = importJson.import(jsonString);

        expect(importedShapes.length).toBe(shapes.length);
        for (let i = 0; i < shapes.length; i++) {
            expect(JSON.stringify(importedShapes[i].getProps()))
                .toEqual(JSON.stringify(shapes[i].getProps()));
        }
    });

    it('should export and import XML correctly', () => {
        const exportXML = new ExportXML();
        const importXML = new ImportXML();

        const xmlString = exportXML.export(shapes);
        const importedShapes = importXML.import(xmlString);

        expect(importedShapes.length).toBe(shapes.length);
        for (let i = 0; i < shapes.length; i++) {
            expect(JSON.stringify(importedShapes[i].getProps()))
                .toEqual(JSON.stringify(shapes[i].getProps()));
        }
    });

});
