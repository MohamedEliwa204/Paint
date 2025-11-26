import { ShapeSelection } from "../../services/shape-selection";
const styleAttributes = [
    'fill',
    'stroke',
    'strokeWidth',
    'dash',
    'lineCap',
    'lineJoin',
    'opacity',
    'shadowColor',
    'shadowBlur',
    'shadowOffsetX',
    'shadowOffsetY',
    'shadowOpacity'
];


export class ShapesLogic {
    // Placeholder for future shape logic methods
    shapeService: ShapeSelection;
    constructor(shapeService: ShapeSelection) {
        this.shapeService = shapeService;
    }

    selectShape(shape: any) {
        shape.on("click", (e: any) => {
            // Don't change selection while drawing
            if (this.shapeService.getIsDrawing()) {
                return;
            }

            const isCtrlPressed = e.evt && (e.evt.ctrlKey || e.evt.metaKey);
            const currentSelection = this.shapeService.getSelectedShapes();

            if (isCtrlPressed) {
                // Ctrl+Click: toggle shape in multi-selection
                const isAlreadySelected = currentSelection.includes(shape);

                if (isAlreadySelected) {
                    // Remove from selection
                    const newSelection = currentSelection.filter((s: any) => s !== shape);
                    this.shapeService.selectedShapes.set(newSelection);
                    this.shapeService.setKonvaShape(newSelection.length > 0 ? newSelection[0] : null);
                    console.log("Shape removed from selection");
                } else {
                    // Add to selection
                    const newSelection = [...currentSelection, shape];
                    this.shapeService.selectedShapes.set(newSelection);
                    this.shapeService.setKonvaShape(shape);
                    console.log("Shape added to selection");
                }
            } else {
                // Regular click: single selection
                if (this.shapeService.getKonvaShape() === shape && currentSelection.length === 1) {
                    // Deselect if clicking same shape
                    this.shapeService.clearSelection();
                    console.log("Shape deselected");
                } else {
                    // Select only this shape
                    this.shapeService.selectedShapes.set([shape]);
                    this.shapeService.setKonvaShape(shape);
                    console.log("Shape selected");
                }
            }
        });
    }

    onDrawingShape(shape: any) {
        shape.on("mousedown", () => {
            if (this.shapeService.getIsDrawing()) {
                shape.draggable(false);
                return;
            }
            else {
                shape.draggable(true);
            }
            console.log("Shape drag started:", shape);
            // Additional logic for when a shape's drag starts can be added here
        });
    }

    // Don't forget to add listeners to update shape on drag and transform

    // Send shape to backend
    onShapeDragEnd(shape: any) {
        shape.on("dragend", () => {
            console.log("Shape drag ended:", shape);
            // Additional logic for when a shape's drag ends can be added here
        });
    }

    // Send shape to backend
    onShapeTransformEnd(shape: any) {
        shape.on("transformend", () => {
            console.log("Shape transform ended:", shape);
            // Additional logic for when a shape's transform ends can be added here
        });
    }


    // Send updated style to backend
    onShapeAttStyleChange(shape: any) {
        shape.on("styleChange", (e: Event) => {
            // Additional logic for when a shape's style attribute changes can be added here
            if (e && styleAttributes.includes((e as any).attributeName)) {
                console.log(`Shape style attribute changed: ${(e as any).attributeName}`);
            }
        });
    }

    // onDraggingShape(shape: any) {
    //     shape.dragBoundFunc((pos: { x: number, y: number }) => {
    //         const stage = shape.getStage();
    //         if (!stage) return pos;
    //         const width = shape.width() || shape.radius() * 2 || 0;
    //         const height = shape.height() || shape.radius() * 2 || 0;

    //         const stageWidth = shape.getStage()!.width();
    //         const stageHeight = shape.getStage()!.height();

    //         return {
    //             x: Math.max(0, Math.min(pos.x, stageWidth - width)),
    //             y: Math.max(0, Math.min(pos.y, stageHeight - height)),
    //         };
    //     })
    // }


}
