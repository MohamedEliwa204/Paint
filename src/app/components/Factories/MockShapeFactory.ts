import Konva from 'konva';

export type ShapeType =
    | 'rectangle'
    | 'circle'
    | 'ellipse'
    | 'line'
    | 'square'
    | 'triangle-non-eq'   // equilateral triangle
    | 'triangle'     // non-equilateral
    | 'free-draw';

export class MockShapeFactory {
    createShape(
        type: ShapeType,
        x: number,
        y: number,
        width: number,
        height: number,
        styles: {[key: string]: any }
    ): Konva.Shape | undefined {
        switch (type) {
            case 'rectangle':
                return new Konva.Rect({
                    x,
                    y,
                    width,
                    height,
                    fill: 'rgba(0,0,255,0.3)',
                    stroke: 'blue',
                    strokeWidth: 2,
                    draggable: true,
                    ...styles
                });

            case 'square':
                return new Konva.Rect({
                    x,    
                    y,
                    width,
                    height: width,
                    fill: 'rgba(0,0,255,0.3)',
                    stroke: 'blue',
                    strokeWidth: 2,
                    draggable: true,
                    ...styles
                });

            case 'circle':
                return new Konva.Circle({
                    x: x + width / 2,
                    y: y + height / 2,
                    radius: Math.max(width, height) / 2,
                    fill: 'rgba(0,255,0,0.3)',
                    stroke: 'green',
                    strokeWidth: 2,
                    draggable: true,
                    ...styles
                });

            case 'ellipse':
                return new Konva.Ellipse({
                    x: x + width / 2,
                    y: y + height / 2,
                    radiusX: width / 2,
                    radiusY: height / 2,
                    fill: 'rgba(255,0,0,0.3)',
                    stroke: 'red',
                    strokeWidth: 2,
                    draggable: true,
                    ...styles
                });

            case 'line':
                return new Konva.Line({
                    points: [x, y, x, y], // start = end, will update dynamically
                    stroke: 'black',
                    strokeWidth: 2,
                    draggable: true,
                    ...styles
                });

            case 'triangle':
                return new Konva.RegularPolygon({
                    x: x,
                    y: y,
                    sides: 3,
                    radius: 0, // will update dynamically
                    fill: 'rgba(255,165,0,0.3)',
                    stroke: 'orange',
                    strokeWidth: 2,
                    draggable: true,
                    ...styles
                });
            case 'free-draw': 
            return new Konva.Line({
                points: [x, y], // start point, will update dynamically
                stroke: 'black',
                strokeWidth: 2,
                draggable: true,
                lineCap: 'round',
                lineJoin: 'round',
                ...styles
            })    

            // case 'triangle-non-eq':
            //     return new Konva.Line({
            //         points: [x, y, x, y, x, y], // 3 points, updated dynamically
            //         closed: true,
            //         fill: 'rgba(255,165,0,0.3)',
            //         stroke: 'orange',
            //         strokeWidth: 2,
            //         draggable: true,
            //     });

            default:
                return undefined;
        }
    }
}
