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
  private readonly shapeService = inject(ShapeSelection);
  private readonly elementRef = inject(ElementRef);

  private svg: SVGSVGElement | null = null;
  private selectedElement: SVGGraphicsElement | null = null;

  private isDragging = false;
  private isResizing = false;
  private activeResizeHandle: string | null = null;


  get selectedShape() {
    return this.shapeService.selectedShape();
  }

  ngAfterViewInit() {
    this.svg = this.elementRef.nativeElement.querySelector('#canvas');
    if (this.svg) {
      this.setupGlobalEvents();
    }
  }

  private setupGlobalEvents() {
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

    const svgPoint = this.toSvgPoint(event);
    const shape = this.selectedShape;
    // give the shapes this class
    if (target.classList.contains('resize-handle')) {
      if (shape) {
        this.isResizing = true;
        // Get which handle was clicked
        this.activeResizeHandle = target.getAttribute('data-position');

        shape.startResize(svgPoint.x, svgPoint.y, this.activeResizeHandle);
      }
      event.stopPropagation(); //  don't start dragging too
      return;
    }

    if (target !== this.svg && target.tagName !== 'svg') {
      const shape = this.selectedShape;
      this.isDragging = true;
      this.selectedElement = target;

      const svgPoint = this.toSvgPoint(event);

      if (shape) {
        shape.startDrag(svgPoint.x, svgPoint.y);
      }
      target.style.cursor = 'grabbing';
      target.style.opacity = '0.7';
    }

    if (target.tagName === 'svg' || target.id === 'canvas') {
      // This makes the handles disappear
      this.shapeService.setSelectedShape(null);
      this.isDragging = false;
      this.isResizing = false;
      this.selectedElement = null;
    }

  }

  private onMouseMove(event: MouseEvent) {
    if (!this.svg) return;
    const shape = this.selectedShape;
    const svgPoint = this.toSvgPoint(event);


    if (!shape) {
      return;
    }
    if (this.isResizing) {
      shape.resizing(svgPoint.x, svgPoint.y);
      return;
    }


    if (this.isDragging && this.selectedElement) {
      shape.dragTo(svgPoint.x, svgPoint.y);
      shape.applyPositionToElement(this.selectedElement);
    }


  }

  private onMouseUp() {

    const shape = this.selectedShape;
    if (this.isResizing) {
      if (shape) shape.endResizing();
      this.isResizing = false;
      this.activeResizeHandle = null;
    }


    if (this.isDragging && this.selectedElement) {
      if (shape) shape.endDrag();
      this.selectedElement.style.cursor = 'grab';
      this.selectedElement.style.opacity = '1';
      this.isDragging = false;
      this.selectedElement = null;
    }


  }
}
