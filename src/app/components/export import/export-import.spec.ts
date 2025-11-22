import { LineShape } from '../../models/concreteClasses/line-shape';
import { RectangleShape } from '../../models/concreteClasses/rectangle-shape';
import { SquareShape } from '../../models/concreteClasses/square-shape';
import { EllipseShape } from '../../models/concreteClasses/ellipse-shape';
import { CircleShape } from '../../models/concreteClasses/circle-shape';
import { PolygonShape } from '../../models/concreteClasses/polygon-shape';

import { ExportJson } from './export_json';
import { ImportJson } from './import_json';
import { ExportXML } from './export_XML';
import { ImportXML } from './import_XML';

describe('Shape Import/Export (New Hierarchy)', () => {

    let shapes: any[];

    beforeEach(() => {
        shapes = [
            new LineShape({
                id: "1",
                type: "line",
                x1: 0,
                y1: 0,
                x2: 100,
                y2: 100,
                shapeStyles: { stroke: "black", strokeWidth: 2 }
            }),

            new CircleShape({
                id: "4",
                type: "circle",
                cx: 200,
                cy: 200,
                r: 25,
                shapeStyles: { fill: "red" }
            }),

            new SquareShape({
                id: "3",
                type: "square",
                x: 100,
                y: 100,
                width: 50,
                height: 50,
                shapeStyles: { fill: "green" }
            }),

            new RectangleShape({
                id: "2",
                type: "rectangle",
                x: 10,
                y: 10,
                width: 50,
                height: 80,
                shapeStyles: { fill: "blue" }
            }),

            new PolygonShape({
                id: "5",
                type: "polygon",
                points: [
                    { x: 0, y: 0 },
                    { x: 50, y: 0 },
                    { x: 25, y: 50 }
                ],
                shapeStyles: { fill: "orange" }
            })
        ];
    });

    function normalize(shape: any) {
        // Ensure stable and comparable structure
        return JSON.stringify(shape);
    }

    it('should export and import JSON correctly', () => {
        const exportJson = new ExportJson();
        const importJson = new ImportJson();

        const jsonString = exportJson.export(shapes);
        const importedShapes = importJson.import(jsonString);

        expect(importedShapes.length).toBe(shapes.length);

        for (let i = 0; i < shapes.length; i++) {
            expect(normalize(importedShapes[i])).toEqual(normalize(shapes[i]));
        }
    });

    it('should export and import XML correctly', () => {
        const exportXML = new ExportXML();
        const importXML = new ImportXML();

        const xmlString = exportXML.export(shapes);
        const importedShapes = importXML.import(xmlString);

        expect(importedShapes.length).toBe(shapes.length);

        for (let i = 0; i < shapes.length; i++) {
            expect(normalize(importedShapes[i])).toEqual(normalize(shapes[i]));
        }
    });

});
