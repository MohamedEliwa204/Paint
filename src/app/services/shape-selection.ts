import { Injectable, signal, WritableSignal } from '@angular/core';
import { BaseShape } from '../models/concreteClasses/base-shape';
import Konva from 'konva';


@Injectable({
  providedIn: 'root',
})
export class ShapeSelection {
  selectedShape: WritableSignal<string | null> = signal<string | null>(null);
  isDrawing: WritableSignal<boolean> = signal<boolean>(false);
  selectedKonvaShape: WritableSignal<Konva.Shape | null> = signal<Konva.Shape | null>(null);
  styles: WritableSignal<any> = signal<any>({ stroke: '#000000', strokeWidth: 2, fill: '#ffffff', opacity: 1, lineCap: 'butt', dash: [] });

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

}
