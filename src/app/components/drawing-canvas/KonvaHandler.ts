import { Signal } from "@angular/core";
import Konva from "konva";
import { MockShapeFactory } from "../Factories/MockShapeFactory";
import { Shape } from "konva/lib/Shape";
import { ShapesLogic } from "./shapes-logic";
export class KonvaHandler {
    private stage: Konva.Stage;
    private layer: Konva.Layer;
    private iniX: number = 0;
    private iniY: number = 0;
    private finX: number = 0;
    private finY: number = 0;
    mockShape: Konva.Shape | undefined = undefined;
    private mockFactory = new MockShapeFactory();
    private shapeService: any;
    private isDrawingMode = false;
    // Array to keep track of created shapes
    private shapes: Konva.Shape[] = [];

    private shapeLogic: ShapesLogic;

    constructor(containerId: string, width: number, height: number, shapeService: any) {
        this.shapeService = shapeService;
        this.stage = new Konva.Stage({ container: containerId, width: width, height: height });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.shapeLogic = new ShapesLogic(shapeService);
        this.onMouseDown();
        this.onMouseMove();
        this.onMouseUp();
    }

    get selectedShape() {
        return this.shapeService.selectedShape();
    }

    get styles() {
        console.log(this.shapeService.currentStyles);
        return this.shapeService.currentStyles;
    }

    get isDrawing() {
        return this.shapeService.isDrawing();
    }


    onMouseDown() {
        this.stage.on("mousedown touchdown", () => {
            let Position = this.stage.getPointerPosition();
            if (!Position || !this.isDrawing) return;
            this.iniX = Position.x;
            this.iniY = Position.y;
            let styles = this.selectedShape.shapeStyles;
            if (this.styles.dash && typeof this.styles.dash === 'string') {
                styles.dash = this.styles.dash.split(',').map((s: string) => Number(s.trim())).filter((n: number) => !isNaN(n)) || [];
            }
            const shape = this.selectedShape;
            console.log(styles.dash);
            console.log(this.styles);
            if (shape) {
                this.mockShape = this.mockFactory.createShape(shape.type as 'rectangle' | 'circle' | 'ellipse' | 'line' | 'square' | 'triangle' | 'free-draw', this.iniX, this.iniY, 0, 0, { ...styles });
                if (this.mockShape) {
                    this.layer.add(this.mockShape);
                }
            }
            this.layer.batchDraw();
        })
    }

    onMouseMove() {
        this.stage.on("mousemove touchmove", () => {
            let position = this.stage.getPointerPosition();
            if (!position || !this.mockShape || !this.isDrawing) return;
            this.finX = position.x;
            this.finY = position.y;
            let width = Math.abs(this.finX - this.iniX);
            let height = Math.abs(this.finY - this.iniY);
            let x = Math.min(this.finX, this.iniX);
            let y = Math.min(this.finY, this.iniY);
            let type = this.selectedShape?.type;
            if (type === 'rectangle') {
                this.mockShape.x(x);
                this.mockShape.y(y);
                this.mockShape.width(width);
                this.mockShape.height(height);
            }
            else if (type === 'square') {
                this.mockShape.x(x);
                this.mockShape.y(y);
                this.mockShape.width(width);
                this.mockShape.height(width);
            }
            else if (type === 'square') {
                this.mockShape.x(x);
                this.mockShape.y(y);
                this.mockShape.width(width);
                this.mockShape.height(width);
            }
            else if (type === 'circle' && this.mockShape instanceof Konva.Circle) {
                this.mockShape.x(x + width / 2);
                this.mockShape.y(y + height / 2);
                this.mockShape.radius(Math.max(width, height) / 2);
            }
            else if (this.mockShape instanceof Konva.Ellipse) {
                this.mockShape.x(x + width / 2);
                this.mockShape.y(y + height / 2);
                this.mockShape.radiusX(width / 2);
                this.mockShape.radiusY(height / 2);
            }
            else if (this.mockShape instanceof Konva.Line && type === 'line') {
                this.mockShape.points([this.iniX, this.iniY, this.finX, this.finY]);
            }
            else if (this.mockShape instanceof Konva.RegularPolygon) {
                this.mockShape.x((this.iniX + this.finX) / 2);
                this.mockShape.y((this.iniY + this.finY) / 2);
                this.mockShape.radius(Math.max(width, height) / 2);
            }
            else if (type === 'free-draw' && this.mockShape instanceof Konva.Line) {
                const points = this.mockShape.points().concat([this.finX, this.finY]);
                this.mockShape.points(points);
            }
            this.layer.batchDraw();
        })
    }

    // TODO convert to SVG shape and add to svg canvas
    // TODO send request to backend to create shape
    onMouseUp() {
        this.stage.on("mouseup touchend", () => {
            if (this.mockShape) {
                // Stay stale until backend responds with created shape
                // After the backend responds , finalize the shape creation

                this.layer.add(this.mockShape);
                this.shapeLogic.selectShape(this.mockShape);
                this.shapeLogic.onDrawingShape(this.mockShape);
                this.shapeLogic.onShapeDragEnd(this.mockShape);
                this.shapeLogic.onShapeTransformEnd(this.mockShape);
                this.shapeLogic.onShapeAttStyleChange(this.mockShape);
                this.layer.batchDraw();
                this.shapes.push(this.mockShape);
                this.mockShape = undefined;
            }
        })

    }
}