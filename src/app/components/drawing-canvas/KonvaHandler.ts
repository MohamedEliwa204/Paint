import Konva from "konva";
import { MockShapeFactory } from "../Factories/MockShapeFactory";
import { ShapesLogic } from "./shapes-logic";

export class KonvaHandler {
    private stage: Konva.Stage;
    private layer: Konva.Layer;
    private iniX: number = 0;
    private iniY: number = 0;
    private finX: number = 0;
    private finY: number = 0;
    private selectionRectangle: Konva.Rect;
    private isSelecting = false;
    private x1 = 0;
    private y1 = 0;
    private x2 = 0;
    private y2 = 0;
    mockShape: Konva.Shape | undefined = undefined;
    private mockFactory = new MockShapeFactory();
    private shapeService: any;
    private shapeLogic: ShapesLogic;
    private transformer: Konva.Transformer;

    constructor(containerId: string, width: number, height: number, shapeService: any) {
        this.shapeService = shapeService;
        this.stage = new Konva.Stage({ container: containerId, width: width, height: height });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.transformer = new Konva.Transformer({
            nodes: [],
            padding: 5,
            borderStroke: '#3b82f6',
            borderDash: [4, 4],
            anchorStroke: '#3b82f6',
            anchorFill: 'white',
            anchorSize: 10,
            anchorCornerRadius: 2,
            rotateAnchorOffset: 30,
            anchorStyleFunc: (anchor) => {
                if (anchor.hasName('rotater')) {
                    anchor.width(20);
                    anchor.height(20);
                    anchor.cornerRadius(10);
                    anchor.fill('#ffffff');
                    anchor.stroke('#3b82f6');
                    anchor.strokeWidth(2);
                    
                     const originalSceneFunc = anchor.sceneFunc();
                     anchor.sceneFunc((ctx, shape) => {
                         originalSceneFunc.call(anchor, ctx, shape);
                         ctx.save();
                         ctx.fillStyle = '#3b82f6';
                         ctx.font = 'bold 18px sans-serif';
                         ctx.textAlign = 'center';
                         ctx.textBaseline = 'middle';
                         ctx.fillText('↻', shape.width() / 2, shape.height() / 2);
                         ctx.restore();
                     });
                }
            }
        });
        this.layer.add(this.transformer);

        this.selectionRectangle = new Konva.Rect({
            fill: 'rgba(0, 161, 255, 0.3)',
            visible: false,
            stroke: '#00a1ff',
            strokeWidth: 1,
            listening: false 
        });
        this.layer.add(this.selectionRectangle);

        this.shapeService.setMainLayer(this.layer);
        this.shapeLogic = new ShapesLogic(shapeService);
        this.onMouseDown();
        this.onMouseMove();
        this.onMouseUp();
    }

    public updateSelection(selectedShape: any) {
        if (selectedShape) {
            this.transformer.nodes([selectedShape]);
            this.transformer.moveToTop();
        } else {
            const shapes = this.shapeService.getSelectedShapes();
            if (shapes && shapes.length > 0) {
                this.transformer.nodes(shapes);
                this.transformer.moveToTop();
            } else {
                this.transformer.nodes([]);
            }
        }
        this.layer.batchDraw();
    }

    get selectedShapeType() {
        return this.shapeService.getSelectedShape();
    }

    get styles() {
        return this.shapeService.currentStyles;
    }

    get isDrawing() {
        return this.shapeService.isDrawing();
    }

    onMouseDown() {
        this.stage.on("mousedown touchdown", (e) => {
            let Position = this.stage.getPointerPosition();
            if (!Position) return;

            if (this.isDrawing) {
                this.iniX = Position.x;
                this.iniY = Position.y;
                let styles = this.styles || {};
                if (this.styles.dash && typeof this.styles.dash === 'string') {
                    styles.dash = this.styles.dash.split(',').map((s: string) => Number(s.trim())).filter((n: number) => !isNaN(n)) || [];
                }
                const shapeType = this.shapeService.getSelectedShape();
                if (shapeType) {
                    this.mockShape = this.mockFactory.createShape(shapeType as any, this.iniX, this.iniY, 0, 0, { ...styles });
                    if (this.mockShape) {
                        this.layer.add(this.mockShape);
                    }
                }
                this.layer.batchDraw();
                return;
            }

            if (e.target === this.stage) {
                e.evt.preventDefault();
                this.isSelecting = true;
                this.x1 = Position.x;
                this.y1 = Position.y;
                this.x2 = Position.x;
                this.y2 = Position.y;

                this.selectionRectangle.visible(true);
                this.selectionRectangle.width(0);
                this.selectionRectangle.height(0);
                this.layer.batchDraw();
            }
        });
    }

    onMouseMove() {
        this.stage.on("mousemove touchmove", (e) => {
            let position = this.stage.getPointerPosition();
            if (!position) return;

            if (this.isDrawing && this.mockShape) {
                this.finX = position.x;
                this.finY = position.y;
                let width = Math.abs(this.finX - this.iniX);
                let height = Math.abs(this.finY - this.iniY);
                let x = Math.min(this.finX, this.iniX);
                let y = Math.min(this.finY, this.iniY);
                let type = this.shapeService.getSelectedShape();

                if (type === 'rectangle') {
                    this.mockShape.x(x); this.mockShape.y(y);
                    this.mockShape.width(width); this.mockShape.height(height);
                }
                else if (type === 'square') {
                    this.mockShape.x(x); this.mockShape.y(y);
                    this.mockShape.width(width); this.mockShape.height(width);
                }
                else if (type === 'circle' && this.mockShape instanceof Konva.Circle) {
                    this.mockShape.x(x + width / 2); this.mockShape.y(y + height / 2);
                    this.mockShape.radius(Math.max(width, height) / 2);
                }
                else if (this.mockShape instanceof Konva.Ellipse) {
                    this.mockShape.x(x + width / 2); this.mockShape.y(y + height / 2);
                    this.mockShape.radiusX(width / 2); this.mockShape.radiusY(height / 2);
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
                return;
            }

            if (this.isSelecting) {
                e.evt.preventDefault();
                this.x2 = position.x;
                this.y2 = position.y;

                this.selectionRectangle.setAttrs({
                    visible: true,
                    x: Math.min(this.x1, this.x2),
                    y: Math.min(this.y1, this.y2),
                    width: Math.abs(this.x2 - this.x1),
                    height: Math.abs(this.y2 - this.y1),
                });
                this.layer.batchDraw();
            }
        });
    }

    onMouseUp() {
        this.stage.on("mouseup touchend", () => {
            this.isSelecting = false;

            if (this.mockShape) {
                this.layer.add(this.mockShape);
                this.shapeLogic.selectShape(this.mockShape);
                this.shapeLogic.onDrawingShape(this.mockShape);
                this.shapeLogic.onShapeDragEnd(this.mockShape);
                this.shapeLogic.onShapeTransformEnd(this.mockShape);
                this.shapeLogic.onShapeAttStyleChange(this.mockShape);
                this.layer.batchDraw();
                this.shapeService.addToShapesArray(this.mockShape);
                this.mockShape = undefined;
                return;
            }

            if (this.selectionRectangle.visible()) {
                const box = this.selectionRectangle.getClientRect();
                this.selectionRectangle.visible(false);
                
                const shapes = this.layer.getChildren().filter((shape) => {
                    if (shape === this.selectionRectangle || shape === this.transformer) return false;
                    return Konva.Util.haveIntersection(box, shape.getClientRect());
                }) as Konva.Shape[];

                this.transformer.nodes(shapes);
                this.shapeService.setSelectedShapes(shapes);
                
                if (shapes.length === 1) {
                    this.shapeService.setKonvaShape(shapes[0]);
                } else {
                    this.shapeService.setKonvaShape(null);
                }
                
                this.layer.batchDraw();
            }
        });
    }
}