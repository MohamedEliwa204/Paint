import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseShape } from '../models/concreteClasses/base-shape';
import Konva from 'konva';


@Injectable({
  providedIn: 'root',
})
export class ShapeSelection {
  selectedKonvaShapes: WritableSignal<Konva.Shape[]> = signal<Konva.Shape[]>([]);
  private mainLayer: Konva.Layer | null = null;
  selectedShape: WritableSignal<string | null> = signal<string | null>(null);
  isDrawing: WritableSignal<boolean> = signal<boolean>(false);
  selectedKonvaShape: WritableSignal<Konva.Shape | null> = signal<Konva.Shape | null>(null);
  styles: WritableSignal<any> = signal<any>({ stroke: '#000000', strokeWidth: 2, fill: '#ffffff', opacity: 1, lineCap: 'butt', dash: [] });
  shapeArray : Konva.Shape[] = [];
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
    console.log("isDrawing set to:", drawing);
  }
  getIsDrawing() {
    return this.isDrawing();
  }

  getKonvaShape() {
    return this.selectedKonvaShape();
  }

  setKonvaShape(shape: Konva.Shape | null) {
    this.selectedKonvaShape.set(shape)
  }
  setMainLayer(layer: Konva.Layer) {
    this.mainLayer = layer;
  }
  getMainLayer(): Konva.Layer | null {
    return this.mainLayer;
  }

  addToShapesArray(shape: Konva.Shape) {
    this.shapeArray.push(shape);
    console.log(this.shapeArray)
  }

  removeFromShapesArray(shape: Konva.Shape) {
    this.shapeArray = this.shapeArray.filter(element => element != shape) ;
    console.log(this.shapeArray)
  }
getSelectedShapes() {
    return this.selectedKonvaShapes();
  }

  setSelectedShapes(shapes: Konva.Shape[]) {
    this.selectedKonvaShapes.set(shapes);
  }
}
