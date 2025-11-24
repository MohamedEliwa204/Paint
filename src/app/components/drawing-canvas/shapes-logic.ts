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
            console.log("Shape clicked:", shape);
            console.log("Currently selected shape:", this.shapeService.getKonvaShape());
            if (this.shapeService.getKonvaShape() === shape) {
                this.shapeService.setSelectedShape(null);
                console.log("Shape deselected");
            } else {
                this.shapeService.setKonvaShape(shape);
                console.log("Shape selected");
                console.log("Newly selected shape:", this.shapeService.getKonvaShape());
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


}