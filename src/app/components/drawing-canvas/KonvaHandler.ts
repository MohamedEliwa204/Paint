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
    mockShape: Konva.Shape | undefined = undefined;
    private mockFactory = new MockShapeFactory();
    private shapeService: any;
    private isDrawingMode = false;
    private shapeLogic: ShapesLogic;
    private transformer: Konva.Transformer;

    // Multi-selection support
    private selectionRectangle: Konva.Rect | null = null;
    private isSelectingArea = false;
    private selectionStartX = 0;
    private selectionStartY = 0;

    constructor(containerId: string, width: number, height: number, shapeService: any) {
        this.shapeService = shapeService;
        this.stage = new Konva.Stage({ container: containerId, width: width, height: height });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.transformer = new Konva.Transformer({
            nodes: [],
            padding: 5,
            anchorStroke: 'red',
            anchorFill: 'white',
            boundBoxFunc: (oldBox, newBox) => {
                // Limit resize to prevent negative dimensions
                if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                }
                return newBox;
            }
        });
        this.layer.add(this.transformer);

        this.shapeService.setMainLayer(this.layer);
        this.shapeLogic = new ShapesLogic(shapeService);
        this.onMouseDown();
        this.onMouseMove();
        this.onMouseUp();
        this.setupKeyboardShortcuts();
        this.setupStageClickHandler();
    }

    public updateSelection(selectedShape: any) {
        const selectedShapes = this.shapeService.getSelectedShapes();
        console.log('updateSelection called - selectedShapes count:', selectedShapes.length);

        if (selectedShapes.length > 0) {
            // Multi-selection mode: attach transformer to all selected shapes
            console.log('Setting transformer nodes to', selectedShapes.length, 'shapes');
            this.transformer.nodes(selectedShapes);
            this.transformer.moveToTop();
        } else if (selectedShape) {
            // Single selection for backward compatibility
            console.log('Setting transformer to single shape (backward compatibility)');
            this.transformer.nodes([selectedShape]);
            this.transformer.moveToTop();
        } else {
            console.log('Clearing transformer (no selection)');
            this.transformer.nodes([]);
        }
        this.layer.batchDraw();
    }

    private setupStageClickHandler() {
        // Click on empty area to deselect all
        this.stage.on('click', (e) => {
            // If clicked on stage background
            if (e.target === this.stage) {
                this.shapeService.clearSelection();
                this.updateSelection(null);
            }
        });
    }

    private setupKeyboardShortcuts() {
        // Delete selected shapes with Delete or Backspace key
        globalThis.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                // Check if not typing in an input field
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    this.shapeService.deleteSelectedShapes();
                    this.updateSelection(null);
                }
            }

            // Select all with Ctrl+A
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                const allShapes = this.shapeService.getShapesArray();
                if (allShapes.length > 0) {
                    this.shapeService.selectedShapes.set(allShapes);
                    this.updateSelection(null);
                }
            }
        });
    }

    get selectedShapeType() {
        return this.shapeService.getSelectedShape();
    }

    get styles() {
        console.log(this.shapeService.currentStyles);
        return this.shapeService.currentStyles;
    }

    get isDrawing() {
        return this.shapeService.isDrawing();
    }


    onMouseDown() {
        this.stage.on("mousedown touchdown", (e) => {
            let Position = this.stage.getPointerPosition();
            if (!Position) return;

            const clickedOnEmpty = e.target === this.stage;
            const isCtrlPressed = e.evt && (e.evt.ctrlKey || e.evt.metaKey);

            // If in drawing mode, create shape
            if (this.isDrawing && this.shapeService.getSelectedShape()) {
                this.iniX = Position.x;
                this.iniY = Position.y;
                let styles = this.styles || {};
                if (this.styles.dash && typeof this.styles.dash === 'string') {
                    styles.dash = this.styles.dash.split(',').map((s: string) => Number(s.trim())).filter((n: number) => !isNaN(n)) || [];
                }
                const shapeType = this.shapeService.getSelectedShape();
                if (shapeType) {
                    this.mockShape = this.mockFactory.createShape(shapeType as 'rectangle' | 'circle' | 'ellipse' | 'line' | 'square' | 'triangle' | 'free-draw', this.iniX, this.iniY, 0, 0, { ...styles });
                    if (this.mockShape) {
                        this.layer.add(this.mockShape);
                    }
                }
                this.layer.batchDraw();
                return;
            }

            // If not drawing and clicked on empty space, start selection rectangle
            if (!this.isDrawing && clickedOnEmpty && !isCtrlPressed) {
                this.isSelectingArea = true;
                this.selectionStartX = Position.x;
                this.selectionStartY = Position.y;

                // Create selection rectangle
                this.selectionRectangle = new Konva.Rect({
                    x: Position.x,
                    y: Position.y,
                    width: 0,
                    height: 0,
                    fill: 'rgba(0, 123, 255, 0.1)',
                    stroke: 'rgba(0, 123, 255, 0.8)',
                    strokeWidth: 1,
                    dash: [4, 4],
                    listening: false
                });
                this.layer.add(this.selectionRectangle);
                this.selectionRectangle.moveToTop();
                this.transformer.moveToTop();
            }
        })
    }

    onMouseMove() {
        this.stage.on("mousemove touchmove", () => {
            let position = this.stage.getPointerPosition();
            if (!position) return;

            // Handle selection rectangle dragging
            if (this.isSelectingArea && this.selectionRectangle) {
                const x = Math.min(this.selectionStartX, position.x);
                const y = Math.min(this.selectionStartY, position.y);
                const width = Math.abs(position.x - this.selectionStartX);
                const height = Math.abs(position.y - this.selectionStartY);

                this.selectionRectangle.setAttrs({
                    x: x,
                    y: y,
                    width: width,
                    height: height
                });
                this.layer.batchDraw();
                return;
            }

            // Handle shape drawing
            if (!this.mockShape || !this.isDrawing) return;
            this.finX = position.x;
            this.finY = position.y;
            let width = Math.abs(this.finX - this.iniX);
            let height = Math.abs(this.finY - this.iniY);
            let x = Math.min(this.finX, this.iniX);
            let y = Math.min(this.finY, this.iniY);
            let type = this.shapeService.getSelectedShape();
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
        this.stage.on("mouseup touchend", (e) => {
            // Handle selection rectangle completion
            if (this.isSelectingArea && this.selectionRectangle) {
                // Use the rectangle's direct position attributes instead of getClientRect
                const selBox = {
                    x: this.selectionRectangle.x(),
                    y: this.selectionRectangle.y(),
                    width: this.selectionRectangle.width(),
                    height: this.selectionRectangle.height()
                };

                console.log('Selection box:', selBox);

                // Select shapes within the selection rectangle
                this.shapeService.selectShapesInRect(selBox, e.evt && (e.evt.ctrlKey || e.evt.metaKey));

                // Remove selection rectangle
                this.selectionRectangle.destroy();
                this.selectionRectangle = null;
                this.isSelectingArea = false;

                // Update transformer to show selected shapes
                this.updateSelection(null);
                this.layer.batchDraw();
                return;
            }

            // Handle shape drawing completion
            if (this.mockShape) {
                // Stay stale until backend responds with created shape
                // After the backend responds , finalize the shape creation

                this.layer.add(this.mockShape);
                this.shapeLogic.selectShape(this.mockShape);
                this.shapeLogic.onDrawingShape(this.mockShape);
                this.shapeLogic.onShapeDragEnd(this.mockShape);
                this.shapeLogic.onShapeTransformEnd(this.mockShape);
                this.shapeLogic.onShapeAttStyleChange(this.mockShape);
                // this.shapeLogic.onDraggingShape(this.mockShape);
                this.layer.batchDraw();
                this.shapeService.addToShapesArray(this.mockShape);
                this.mockShape = undefined;
            }
        })

    }
}
