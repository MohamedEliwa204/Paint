import {Injectable, signal, WritableSignal} from '@angular/core';
import {BaseShape} from '../models/concreteClasses/base-shape';


@Injectable({
  providedIn: 'root',
})
export class ShapeSelection {
  selectedShape: WritableSignal<BaseShape | null> = signal<BaseShape | null>(null);
  isDrawing: WritableSignal<boolean> = signal<boolean>(false);

  get currentStyles() {
    const shape = this.selectedShape();
    return shape ? shape.shapeStyles : {};
  }

  setSelectedShape(shape: BaseShape | null) {
    this.selectedShape.set(shape);
  }

  setIsDrawing(drawing: boolean) {
    this.isDrawing.set(drawing);
    console.log("isDrawing set to:", drawing);
  }
  getIsDrawing() {
    return this.isDrawing();
  }

}
