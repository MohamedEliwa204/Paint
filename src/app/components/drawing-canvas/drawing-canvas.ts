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
  private offset = {x: 0, y: 0};
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

  private onMouseDown(event: MouseEvent) {
    const target = event.target as SVGGraphicsElement;

    if (target !== this.svg && target.tagName !== 'svg') {
      this.isDragging = true;
      this.selectedElement = target;
      const point = this.svg!.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const svgPoint = point.matrixTransform(this.svg!.getScreenCTM()!.inverse());

      if (target.tagName === 'circle' || target.tagName === 'ellipse') {
        this.offset.x = svgPoint.x - parseFloat(target.getAttribute('cx') || '0');
        this.offset.y = svgPoint.y - parseFloat(target.getAttribute('cy') || '0');
      } else if (target.tagName === 'rect') {
        this.offset.x = svgPoint.x - parseFloat(target.getAttribute('x') || '0');
        this.offset.y = svgPoint.y - parseFloat(target.getAttribute('y') || '0');
      }else if (target.tagName === 'line'){
        this.offset.x = svgPoint.x - parseFloat(target.getAttribute('x1') || '0');
        this.offset.y = svgPoint.y - parseFloat(target.getAttribute('y1') || '0');
      }
      target.style.cursor = 'grabbing';
      target.style.opacity = '0.7';
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.selectedElement || !this.svg) {
      return;
    }
    const point = this.svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(this.svg.getScreenCTM()!.inverse());
    const newX = svgPoint.x - this.offset.x;
    const newY = svgPoint.y - this.offset.y;
    const tagName = this.selectedElement.tagName;


    if (tagName === 'circle' || tagName === 'ellipse') {
      this.selectedElement.setAttribute('cx', newX.toString());
      this.selectedElement.setAttribute('cy', newY.toString());
    } else if (tagName === 'rect') {
      this.selectedElement.setAttribute('x', newX.toString());
      this.selectedElement.setAttribute('y', newY.toString());
    } else if (tagName === 'polygon') {
      this.selectedElement.setAttribute('transform', `translate(${newX}, ${newY})`);
    } else if (tagName === 'line') {
      const x1 = parseFloat(this.selectedElement.getAttribute('x1') || '0');
      const y1 = parseFloat(this.selectedElement.getAttribute('y1') || '0');
      const x2 = parseFloat(this.selectedElement.getAttribute('x2') || '0');
      const y2 = parseFloat(this.selectedElement.getAttribute('y2') || '0');
      const dx = newX - x1;
      const dy = newY - y1;

      this.selectedElement.setAttribute('x1', (x1 + dx).toString());
      this.selectedElement.setAttribute('y1', (y1 + dy).toString());
      this.selectedElement.setAttribute('x2', (x2 + dx).toString());
      this.selectedElement.setAttribute('y2', (y2 + dy).toString());
    }

  }

  private onMouseUp() {
    if (this.selectedElement) {
      this.selectedElement.style.cursor = 'grab';
      this.selectedElement.style.opacity = '1';
    }
    this.isDragging = false;
    this.selectedElement = null;
  }
}
