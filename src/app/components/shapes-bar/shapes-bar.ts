import { Component, inject, input, output } from '@angular/core';
import { ShapeSelection } from '../../services/shape-selection';
import { BaseShape } from '../../models/concreteClasses/base-shape';
import { CircleShape } from '../../models/concreteClasses/circle-shape';
import { RectangleShape } from '../../models/concreteClasses/rectangle-shape';
import { EllipseShape } from '../../models/concreteClasses/ellipse-shape';
import { PolygonShape } from '../../models/concreteClasses/polygon-shape';
import { LineShape } from '../../models/concreteClasses/line-shape';
import { SquareShape } from '../../models/concreteClasses/square-shape';
import { FreeLine } from '../../models/concreteClasses/free-line';
import { ShapeStyles } from '../../models/dtos/shape.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-shapes-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './shapes-bar.html',
  styleUrl: './shapes-bar.css',
})
export class ShapesBar {
  private shapeService = inject(ShapeSelection);
  private currentTool: any = null;
  private disabeleTools: boolean = false;
  public currentStyles: ShapeStyles = { stroke: '#000000', strokeWidth: 2, fill: '#ffffff', opacity: 1 };
  private shapeStyles: ShapeStyles = { stroke: '#000000', strokeWidth: 2, fill: '#ffffff', opacity: 1 };
  private isDrawing: boolean = false;
  strokeWidths: number[] = [1, 2, 4, 6];
  opacities: number[] = [1, 0.75, 0.5, 0.25];
  // for Lines 
  lineCaps: ('butt' | 'round' | 'square')[] = ['butt', 'round', 'square'];
  strokeDashArrays: ([number, number])[] = [[4, 2], [8, 4], [2, 6]];

  private createShape(shapeName: string): BaseShape | null {
    console.log('Creating shape:', shapeName);
    console.log(this.shapeStyles)
    switch (shapeName) {
      case 'circle':
        return new CircleShape({ cx: 0, cy: 0, r: 50, type: 'circle', id: '', shapeStyles: this.currentStyles });
      case 'rectangle':
        return new RectangleShape({ x: 0, y: 0, width: 100, height: 50, type: 'rectangle', id: '', shapeStyles: this.currentStyles });
      case 'ellipse':
        return new EllipseShape({ cx: 0, cy: 0, rx: 50, ry: 30, type: 'ellipse', id: '', shapeStyles: this.currentStyles });
      case 'square':
        return new SquareShape({ x: 0, y: 0, width: 50, height: 50, type: 'square', id: '', shapeStyles: this.currentStyles });
      case 'triangle':
        return new PolygonShape({ points: [{ x: 0, y: 100 }, { x: 50, y: 0 }, { x: 100, y: 100 }], type: 'triangle', id: '', shapeStyles: this.currentStyles });
      case 'line':
        return new LineShape({ x1: 0, y1: 0, x2: 100, y2: 100, type: 'line', id: '', shapeStyles: this.currentStyles });
      case 'free-draw':
        return new FreeLine({ points: [{ x: 0, y: 0 }], type: 'free-draw', id: '', shapeStyles: this.currentStyles });
      default:
        return null;
    }

  }

  onClick(shapeName: string) {
    if (this.currentTool === shapeName) {
      this.disabeleTools = !this.disabeleTools;
      this.shapeService.setSelectedShape(null);
      this.isDrawing = false;
    }
    else {
      this.disabeleTools = false;
      this.isDrawing = true;
      console.log("isDrawing:", this.isDrawing);
      this.shapeService.setIsDrawing(true);
      this.currentTool = shapeName;
      const shape = this.createShape(shapeName);
      this.shapeService.setSelectedShape(shape);
      console.log('Selected shape:', shapeName, shape);
    }
    this.shapeService.setIsDrawing(this.isDrawing);
  }

  isSelected(shapeName: string): boolean {
    if (this.disabeleTools) return false;
    const selected = this.shapeService.selectedShape();
    return selected ? selected.type === shapeName : false;
  }

  applyStyle(attr: keyof ShapeStyles, value: any) {
    this.currentStyles[attr] = value;
    this.shapeStyles[attr] = value;
  }
}
