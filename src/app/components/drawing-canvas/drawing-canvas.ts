import {Component, inject, AfterViewInit, ElementRef} from '@angular/core';
import {ShapeSelection} from '../../services/shape-selection';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-drawing-canvas',
  imports: [
    NgIf
  ],
  templateUrl: './drawing-canvas.html',
  styleUrl: './drawing-canvas.css',
})
export class DrawingCanvas implements AfterViewInit {
  private shapeService = inject(ShapeSelection);
  private elementRef = inject(ElementRef);

  private svg: SVGSVGElement | null = null;
  private selectedElement: SVGGraphicsElement | null = null;

  private isDragging = false;

  get selectedShape() {
    return this.shapeService.selectedShape();
  }

  ngAfterViewInit() {
    this.svg = this.elementRef.nativeElement.querySelector('#canvas');
    if (this.svg) {
      this.setupDragAndDrop();
    }
  }

  private setupDragAndDrop() {
    if (!this.svg) {
      return;
    }
    this.svg.addEventListener('mousedown', (event) => this.onMouseDown(event));
    this.svg.addEventListener('mousemove', (event) => this.onMouseMove(event));
    this.svg.addEventListener('mouseup', () => this.onMouseUp());
    this.svg.addEventListener('mouseleave', () => this.onMouseUp());

  }

  private toSvgPoint(event: MouseEvent) {
    if (!this.svg) throw new Error('svg missing');
    const pt = this.svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(this.svg.getScreenCTM()!.inverse());
  }


  private onMouseDown(event: MouseEvent) {
    if (!this.svg) {
      return;
    }
    const target = event.target as SVGGraphicsElement;

    if (target !== this.svg && target.tagName !== 'svg') {
      this.isDragging = true;
      this.selectedElement = target;

      const svgPoint = this.toSvgPoint(event);
      const shape = this.selectedShape;
      // if(shape){
      //   shape.startDrag(svgPoint.x, svgPoint.y);
      // }
      target.style.cursor = 'grabbing';
      target.style.opacity = '0.7';
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.selectedElement || !this.svg) {
      return;
    }
    const svgPoint = this.toSvgPoint(event);
    const shape = this.selectedShape;
    if(!shape){
      return;
    }
    // shape.dragTo(svgPoint.x, svgPoint.y);
    // shape.applyPositionToElement(this.selectedElement);



  }

  private onMouseUp() {
    if (this.selectedElement) {
      const shape = this.selectedShape;
      // if (shape){
      //   shape.endDrag();
      // }
      this.selectedElement.style.cursor = 'grab';
      this.selectedElement.style.opacity = '1';
    }
    this.isDragging = false;
    this.selectedElement = null;
  }
}
