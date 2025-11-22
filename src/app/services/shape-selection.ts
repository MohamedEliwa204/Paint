import {Injectable, signal, WritableSignal} from '@angular/core';
import {BaseShape} from '../models/concreteClasses/base-shape';


@Injectable({
  providedIn: 'root',
})
export class ShapeSelection {
  selectedShape: WritableSignal<BaseShape | null> = signal<BaseShape | null>(null);

  setSelectedShape(shape: BaseShape | null) {
    this.selectedShape.set(shape);
  }
}
