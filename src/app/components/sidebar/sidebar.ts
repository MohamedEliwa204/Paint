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


  public shapeType = computed(() => {
    const shape = this.selectedShape();
    return shape?.attrs?.type || shape?.className;
  });

  isLine = computed(() => {
    const type = this.shapeType();
    return type === 'line' || type === 'Line';
  });

  isFreeDraw = computed(() => {
    const type = this.shapeType();
    return type === 'free-draw' || type === 'Line';
  });
  // Check if shape has specific properties
  hasWidth = computed(() => {
    const type = this.shapeType();
    return ['Rect', 'rectangle', 'square','image'].includes(type);
  });

  hasHeight = computed(() => {
    const type = this.shapeType();
    return ['Rect', 'rectangle', 'square','image'].includes(type);
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
    if (['width', 'height', 'strokeWidth', 'rotation', 'radius', 'radiusX', 'radiusY'].includes(attr)) {
      if (isNaN(numValue)) return;
    }

    switch (attr) {
      case 'width':
        (shape as any).width(Math.max(1, numValue));
        break;
      case 'height':
        (shape as any).height(Math.max(1, numValue));
        break;
      case 'radius':
        (shape as any).radius(Math.max(1, numValue));
        break;
      case 'radiusX':
        (shape as any).radiusX(Math.max(1, numValue));
        break;
      case 'radiusY':
        (shape as any).radiusY(Math.max(1, numValue));
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
        if (this.shapeType() === 'line' || this.shapeType() === 'Line') {
          console.log('Adjusting rotation for line shape');
          let box = (shape as any).getClientRect();
          let points = (shape as any).points();
          let xoffset = box.x + box.width / 2;
          let yoffset = box.y + box.height / 2;
          (shape as any).offsetX(xoffset - points[0]);
          (shape as any).offsetY(yoffset - points[1]);
          console.log('New offsets:', (shape as any).offsetX(), (shape as any).offsetY());
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
    let clone = shape.clone();
    // offset the cloned shape for visibility
    clone.x(clone.x() + 20);
    clone.y(clone.y() + 20);
    this.shapeLogic.onDrawingShape(clone);
    this.shapeLogic.onShapeDragEnd(clone);
    this.shapeLogic.onShapeTransformEnd(clone);
    this.shapeLogic.onShapeAttStyleChange(clone);
    this.shapeLogic.selectShape(clone);
    shape.getLayer()?.add(clone);
    shape.getLayer()?.batchDraw();
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
  }


  isImage = computed(() => {
    const type = this.shapeType();
    return type === 'image' || type === 'Image';
  });

}