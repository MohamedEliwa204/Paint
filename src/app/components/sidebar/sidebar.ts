import { Component, computed, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ShapeSelection } from '../../services/shape-selection';
import { ShapesLogic } from '../drawing-canvas/shapes-logic';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, NgIf],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  private shapeService = inject(ShapeSelection);
  public selectedShape = computed(() => this.shapeService.getKonvaShape());
  private shapeLogic = new ShapesLogic(this.shapeService);
  private maxWidth = document.querySelector('#drawing-canvas')?.clientWidth || 800;
  private maxHeight = document.querySelector('#drawing-canvas')?.clientHeight || 600;
  Math = Math;


  public shapeType = computed(() => {
    const shape = this.selectedShape();
    return shape?.attrs?.type || shape?.className;
  });

  // Method to determine if the panel should be shown
  // Panel is shown only when a shape is selected and not in drawing mode
  showPanel(): boolean {
    return this.selectedShape() !== null && this.shapeService.getIsDrawing() === false;
  }

  isLine = computed(() => {
    const type = this.shapeType();
    return type === 'line' || type === 'Line';
  });

  isFreeDraw = computed(() => {
    const type = this.shapeType();
    return type === 'free-draw' || type === 'Line';
  });

  isSquare = computed(() => {
    const type = this.shapeType();
    return type === 'square' || type === 'Square';
  });

  isTriangle = computed(() => {
    const type = this.shapeType();
    return type === 'triangle' || type === 'Triangle';
  });
  // Check if shape has specific properties
  hasWidth = computed(() => {
    const type = this.shapeType();
    return ['Rect', 'rectangle'].includes(type);
  });

  hasHeight = computed(() => {
    const type = this.shapeType();
    return ['Rect', 'rectangle'].includes(type);
  });

  hasRadius = computed(() => {
    const type = this.shapeType();
    return ['Circle', 'circle'].includes(type);
  });

  hasRadii = computed(() => {
    const type = this.shapeType();
    return ['Ellipse', 'ellipse'].includes(type);
  });


  // Method to update shape attributes
  // call backend to update shape
  update(attr: string, value: any) {
    const shape = this.shapeService.getKonvaShape();
    if (shape == null) return;

    const numValue = Number(value);

    // Validate numeric inputs
    if (['width', 'height', 'strokeWidth', 'rotation', 'radius', 'radiusX', 'radiusY', 'side', 'length'].includes(attr)) {
      if (isNaN(numValue)) return;
    }

    switch (attr) {
      case 'width':
        (shape as any).width(Math.max(1, numValue));
        break;
      case 'height':
        (shape as any).height(Math.max(1, numValue));
        break;
      case 'side':
        if (this.isSquare()) {
          (shape as any).width(Math.max(1, numValue % this.maxHeight));
          (shape as any).height(Math.max(1, numValue % this.maxHeight));
        }
        else if (this.isTriangle()) {
          let side = Math.max(1, numValue % this.maxHeight);
          let raduis = numValue / (2 * Math.sin(Math.PI / 3));
          (shape as any).radius(raduis);
        }
        break;
      case 'length':
        if (this.isLine()) {
          let points = (shape as any).points();
          let x1: number = points[0];
          let y1: number = points[1];
          let x2: number = points[2];
          let y2: number = points[3];
          let dx: number = x2 - x1;
          let dy: number = y2 - y1;
          const currentLength = Math.sqrt(dx * dx + dy * dy);
          if (currentLength === 0) break;
          const scale = numValue / currentLength;
          const newX2 = x1 + dx * scale;
          const newY2 = y1 + dy * scale;
          console.log(`Updating line length to ${numValue}, new endpoint: (${newX2}, ${newY2})`);
          (shape as any).points([x1, y1, newX2, newY2]);
        }
        break;
      case 'radius':
        (shape as any).radius(Math.max(1, numValue % this.maxHeight));
        break;
      case 'radiusX':
        (shape as any).radiusX(Math.max(1, numValue % this.maxWidth));
        break;
      case 'radiusY':
        (shape as any).radiusY(Math.max(1, numValue % this.maxHeight));
        break;
      case 'stroke':
        (shape as any).stroke(value);
        break;
      case 'fill':
        (shape as any).fill(value);
        break;
      case 'strokeWidth':
        (shape as any).strokeWidth(Math.max(0, numValue));
        break;
      case 'opacity':
        (shape as any).opacity(Math.max(0, Math.min(1, numValue)));
        break;
      case 'rotation':
        // fix for line rotation offset issue
        if (this.shapeType() === 'line' || this.shapeType() === 'Line' || this.shapeType() === 'free-draw') {
          console.log('Adjusting rotation for line shape');
          let points = (shape as any).points();
          let xoffset = points[0];
          let yoffset = points[1];
          (shape as any).offsetX(xoffset);
          (shape as any).offsetY(yoffset);
        }
        (shape as any).rotation(numValue % 360);
        break;
      case 'x':
        (shape as any).x(Math.max(0, numValue % this.maxWidth));
        break;
      case 'y':
        (shape as any).y(Math.max(0, numValue % this.maxHeight));
        break;
    }

    shape.getLayer()?.batchDraw();
  }

  getValue(attr: string): any {
    const shape = this.selectedShape();
    if (attr === 'length' && this.isLine()) {
      let points = (shape as any).points();
      let dx = points[2] - points[0];
      let dy = points[3] - points[1];
      return Math.sqrt(dx * dx + dy * dy);
    }
    if (!shape) return 0;
    try {
      return (shape as any)[attr]?.() ?? 0;
    } catch {
      return 0;
    }
  }

  //TODO call backend to duplicate shape

  duplicateShape() {
    // stay stale until backend respond
    let shape = this.shapeService.getKonvaShape();
    if (!shape) return;
    // built in clone method
    const clone = shape.clone();
    // **IMPORTANT: Remove all cloned event listeners**
    clone.off('click');
    clone.off('mousedown');
    clone.off('dragend');
    clone.off('transformend');
    clone.off('styleChange');
    // Replace id with new one
    clone.id(this.generateId());
    // offset the cloned shape for visibility
    clone.x(clone.x() + 20);
    clone.y(clone.y() + 20);
    // Add event listeners to the cloned shape
    // Can be replaced with a method in ShapesLogic
    this.shapeLogic.selectShape(clone);
    this.shapeLogic.onDrawingShape(clone);
    this.shapeLogic.onShapeDragEnd(clone);
    this.shapeLogic.onShapeTransformEnd(clone);
    this.shapeLogic.onShapeAttStyleChange(clone);
    // Reset selection 
    this.shapeService.setKonvaShape(null);
    // Add the cloned shape to the layer
    shape.getLayer()?.add(clone);
    shape.getLayer()?.batchDraw();

    this.shapeService.addToShapesArray(clone);
  }

  //TODO call backend to delete shape
  deleteShape() {
    // stay stale until backend respond
    let shape = this.shapeService.getKonvaShape();
    if (!shape) return;
    shape.destroy();
    this.shapeService.setKonvaShape(null);
    shape.getLayer()?.batchDraw();
    // Don't forget to remove the destroyed shape from shapesArray
    // Add it to the service if needed (and that should be done in the service)
    // we can check the array later for destroyed shapes and remove them (not recommended)
    this.shapeService.removeFromShapesArray(shape);
  }

  generateId(): string {
    return 'shape_' + crypto.randomUUID();
  }
}