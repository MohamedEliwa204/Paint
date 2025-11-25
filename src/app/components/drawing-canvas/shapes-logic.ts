import { Component, Inject, Injectable, signal } from "@angular/core";
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
        shape.on("click", () => {
            // Toggle selection
            // Keep in mind that getSelectedShape returns the shape type name
            // while getKonvaShape returns the actual Konva shape object
            // also keep or remove the isDrawing check based on your requirements
            // here we keep it to avoid changing selection while drawing
            if (this.shapeService.getKonvaShape() === shape && !this.shapeService.getIsDrawing()) {
                // this.shapeService.setSelectedShape(null);
                this.shapeService.setKonvaShape(null);
                console.log("Shape deselected");
            } else if (!this.shapeService.getIsDrawing()) {
                this.shapeService.setKonvaShape(shape);
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