import {Component, inject, input, output} from '@angular/core';
import {ShapeSelection} from '../../services/shape-selection';

@Component({
  selector: 'app-shapes-bar',
  imports: [],
  templateUrl: './shapes-bar.html',
  styleUrl: './shapes-bar.css',
})
export class ShapesBar {
  private shapeService = inject(ShapeSelection);

  onClick(shapeName: string) {

    this.shapeService.setSelectedShape(shapeName);
    console.log('Selected shape:', shapeName);
  }

  isSelected(shapeName: string): boolean {
    return this.shapeService.selectedShape() === shapeName;
  }
}
