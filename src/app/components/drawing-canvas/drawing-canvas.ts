import { Component, inject, AfterViewInit, ElementRef, effect, ChangeDetectorRef } from '@angular/core';
import { ShapeSelection } from '../../services/shape-selection';
import { NgIf } from '@angular/common';
import { KonvaHandler } from './KonvaHandler';
import { ShapesLogic } from './shapes-logic';

@Component({
  selector: 'app-drawing-canvas',
  imports: [NgIf],
  templateUrl: './drawing-canvas.html',
  styleUrl: './drawing-canvas.css',
})
export class DrawingCanvas implements AfterViewInit {
  private readonly shapeService = inject(ShapeSelection);
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  menuPosition = { x: 0, y: 0 };
  selectedShape: any = null;
  private konvaHandler: KonvaHandler | null = null;
  private shapesLogic: ShapesLogic;

  constructor() {
    this.shapesLogic = new ShapesLogic(this.shapeService);

    effect(() => {
      const shape = this.shapeService.getKonvaShape();
      this.selectedShape = shape;

      if (this.konvaHandler) {
        this.konvaHandler.updateSelection(shape);
      }

      if (shape) {
        this.updateMenuPosition(shape);
        shape.off('dragmove.menu transform.menu');
        
        shape.on('dragmove.menu transform.menu', () => {
          this.updateMenuPosition(shape);
          this.cdr.detectChanges();
        });
      }
    });
  }

  ngAfterViewInit() {
    this.initalizeKonva();
  }

  initalizeKonva() {
    const containerEl = document.getElementById('mock-canvas')!;
    this.konvaHandler = new KonvaHandler('mock-canvas', containerEl.clientWidth, containerEl.clientHeight, this.shapeService);
  }

  updateMenuPosition(shape: any) {
    const stage = shape.getStage();
    if (!stage) return;

    const box = shape.getClientRect({ relativeTo: stage.container() });
    
    this.menuPosition = {
      x: box.x + box.width / 2,
      y: box.y - 10
    };
  }

  isText() {
    return this.selectedShape?.getClassName() === 'Text';
  }

  fontSize() {
    return this.selectedShape?.fontSize() || 16;
  }

  isBold() {
    const style = (this.selectedShape?.fontStyle() || '');
    return style.includes('bold');
  }

  isItalic() {
    const style = (this.selectedShape?.fontStyle() || '');
    return style.includes('italic');
  }

  isUnderline() {
    return this.selectedShape?.textDecoration() === 'underline';
  }

  duplicate() {
    if (!this.selectedShape) return;
    
    const clone = this.selectedShape.clone();
    clone.x(clone.x() + 20);
    clone.y(clone.y() + 20);
    clone.id('shape_' + crypto.randomUUID());

    clone.off(); 
    this.shapesLogic.selectShape(clone);
    this.shapesLogic.onDrawingShape(clone);
    this.shapesLogic.onShapeDragEnd(clone);
    this.shapesLogic.onShapeTransformEnd(clone);
    this.shapesLogic.onShapeAttStyleChange(clone);

    const layer = this.selectedShape.getLayer();
    layer?.add(clone);
    layer?.batchDraw();

    this.shapeService.setKonvaShape(clone);
    this.shapeService.addToShapesArray(clone);
  }

  delete() {
    if (!this.selectedShape) return;
    
    const layer = this.selectedShape.getLayer();
    this.selectedShape.destroy();
    this.shapeService.setKonvaShape(null);
    layer?.batchDraw();
  }

  toggleStyle(type: 'bold' | 'italic' | 'underline') {
    if (!this.selectedShape || !this.isText()) return;

    if (type === 'underline') {
      const current = this.selectedShape.textDecoration();
      this.selectedShape.textDecoration(current === 'underline' ? '' : 'underline');
    } else {
      let style = this.selectedShape.fontStyle() || 'normal';
      let hasBold = style.includes('bold');
      let hasItalic = style.includes('italic');

      if (type === 'bold') hasBold = !hasBold;
      if (type === 'italic') hasItalic = !hasItalic;

      let newStyle = 'normal';
      if (hasBold && hasItalic) newStyle = 'italic bold';
      else if (hasBold) newStyle = 'bold';
      else if (hasItalic) newStyle = 'italic';

      this.selectedShape.fontStyle(newStyle);
    }
    this.selectedShape.getLayer()?.batchDraw();
  }

  updateFontSize(val: any) {
    if (!this.selectedShape || !this.isText()) return;
    const size = Number(val);
    if (!isNaN(size) && size > 0) {
      this.selectedShape.fontSize(size);
      this.selectedShape.getLayer()?.batchDraw();
    }
  }
}