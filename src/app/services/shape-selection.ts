import { Injectable, signal, WritableSignal } from '@angular/core';
import Konva from 'konva';


@Injectable({
  providedIn: 'root',
})
export class ShapeSelection {
  private mainLayer: Konva.Layer | null = null;


  selectedShape: WritableSignal<string | null> = signal<string | null>(null);
  isDrawing: WritableSignal<boolean> = signal<boolean>(false);
  selectedKonvaShape: WritableSignal<Konva.Shape | null> = signal<Konva.Shape | null>(null);

  styles: WritableSignal<any> = signal<any>({ stroke: '#000000', strokeWidth: 2, fill: '#ffffff', opacity: 1, lineCap: 'butt', dash: [] });

  shapes: WritableSignal<Konva.Shape[]> = signal<Konva.Shape[]>([]);

  // currently selected shapes (supports multi-selection / marquee)
  selectedShapes: WritableSignal<Konva.Shape[]> = signal<Konva.Shape[]>([]);

  get currentStyles() {
    return this.styles();
  }

  setCurrentStyles(styles: any) {
    this.styles.set(styles);
  }

  setSelectedShape(shape: string | null) {
    this.selectedShape.set(shape);
  }

  getSelectedShape() {
    return this.selectedShape();
  }
  setIsDrawing(drawing: boolean) {
    this.isDrawing.set(drawing);
    console.log('isDrawing set to:', drawing);
  }
  getIsDrawing() {
    return this.isDrawing();
  }

  getKonvaShape() {
    return this.selectedKonvaShape();
  }

  setKonvaShape(shape: Konva.Shape | null) {
    this.selectedKonvaShape.set(shape);
  }
  setMainLayer(layer: Konva.Layer) {
    this.mainLayer = layer;
  }
  getMainLayer(): Konva.Layer | null {
    return this.mainLayer;
  }


  addToShapesArray(shape: Konva.Shape) {
    const arr = this.shapes().slice();
    arr.push(shape);
    this.shapes.set(arr);
    console.log(this.shapes());
  }

  removeFromShapesArray(shape: Konva.Shape) {
    const arr = this.shapes().filter(element => element !== shape);
    this.shapes.set(arr);
    console.log(this.shapes());
  }


  getShapesArray(): Konva.Shape[] {
    return this.shapes();
  }


  getSelectedShapes() {
    return this.selectedShapes();
  }

  clearSelection() {
    this.selectedShapes.set([]);
    this.selectedKonvaShape.set(null);
  }


  // Check if rectangles intersect (overlap)
  private rectsIntersect(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
    return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
  }

  // Check if rectangle a is fully contained within rectangle b
  private rectContains(container: { x: number; y: number; width: number; height: number }, contained: { x: number; y: number; width: number; height: number }) {
    return contained.x >= container.x &&
           contained.y >= container.y &&
           contained.x + contained.width <= container.x + container.width &&
           contained.y + contained.height <= container.y + container.height;
  }

  private getShapeRect(shape: Konva.Shape) {
    // Get absolute coordinates without relativeTo for proper comparison
    const r = shape.getClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }

  selectShapesInRect(rect: { x: number; y: number; width: number; height: number }, additive = false, mode: 'intersect' | 'contain' = 'intersect') {
    const all = this.shapes();
    console.log('=== Selection Rectangle Debug ===');
    console.log('Selection rect:', rect);
    console.log('Total shapes on canvas:', all.length);
    console.log('Selection mode:', mode);

    const matched = all.filter((shape, index) => {
      try {
        const sRect = this.getShapeRect(shape);
        const intersects = this.rectsIntersect(sRect, rect);
        const contained = this.rectContains(rect, sRect);

        console.log(`Shape ${index + 1}:`, {
          shapeRect: sRect,
          intersects: intersects,
          fullyContained: contained,
          selected: mode === 'intersect' ? intersects : contained
        });

        return mode === 'intersect' ? intersects : contained;
      } catch (e) {
        console.warn('Failed to compute shape rect for selection test', e);
        return false;
      }
    });

    console.log('✓ Matched shapes:', matched.length);
    console.log('=================================');

    const newSelection = additive ? Array.from(new Set([...this.selectedShapes(), ...matched])) : matched;
    this.selectedShapes.set(newSelection);

    this.selectedKonvaShape.set(newSelection.length > 0 ? newSelection[0] : null);
  }


  deleteSelectedShapes() {
    const toDelete = this.selectedShapes();
    if (toDelete.length === 0) return;

    for (const shape of toDelete) {
      try {
        shape.destroy();
      } catch (e) {
        console.warn('Failed to destroy shape during deletion', e);
      }
    }

    const remaining = this.shapes().filter(s => !toDelete.includes(s));
    this.shapes.set(remaining);
    this.clearSelection();
    this.mainLayer?.batchDraw();
  }

}
