import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShapeSelection {
  selectedShape = signal<string>('');
  setSelectedShape(shape: string) {
    this.selectedShape.set(shape);
  }
}
