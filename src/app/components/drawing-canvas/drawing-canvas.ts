import { Component, inject, AfterViewInit, ElementRef, effect, ChangeDetectorRef } from '@angular/core';
import { ShapeSelection } from '../../services/shape-selection';
import { NgIf } from '@angular/common';
import Konva from 'konva';
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
  
  selectedShape: Konva.Shape | null = null;
  selectedShapes: Konva.Shape[] = [];

  private konvaHandler: KonvaHandler | null = null;
  private shapesLogic: ShapesLogic;

  constructor() {
    this.shapesLogic = new ShapesLogic(this.shapeService);

    effect(() => {
      this.selectedShape = this.shapeService.getKonvaShape();
      this.selectedShapes = this.shapeService.getSelectedShapes();

      if (this.konvaHandler) {
        this.konvaHandler.updateSelection(this.selectedShape);
      }

      const shapesToWatch = this.selectedShape ? [this.selectedShape] : this.selectedShapes;
      
      if (shapesToWatch.length > 0) {
        this.updateMenuPosition();
        
        shapesToWatch.forEach(s => s.off('dragmove.menu transform.menu'));
        
        shapesToWatch.forEach(s => {
            s.on('dragmove.menu transform.menu', () => {
                this.updateMenuPosition();
                this.cdr.detectChanges();
            });
        });
      }
    });
  }

  get hasSelection() {
    return this.selectedShape !== null || this.selectedShapes.length > 0;
  }

  ngAfterViewInit() {
    this.initalizeKonva();
  }

  initalizeKonva() {
    const containerEl = document.getElementById('mock-canvas')!;
    this.konvaHandler = new KonvaHandler('mock-canvas', containerEl.clientWidth, containerEl.clientHeight, this.shapeService);
  }

  updateMenuPosition() {
    let box: { x: number, y: number, width: number, height: number } | null = null;

    if (this.selectedShape) {
        const stage = this.selectedShape.getStage();
        if(stage) box = this.selectedShape.getClientRect({ relativeTo: stage });
    } else if (this.selectedShapes.length > 0) {
        const stage = this.selectedShapes[0].getStage();
        if(stage) {
            const boxes = this.selectedShapes.map(s => s.getClientRect({ relativeTo: stage }));
            const minX = Math.min(...boxes.map(b => b.x));
            const minY = Math.min(...boxes.map(b => b.y));
            const maxX = Math.max(...boxes.map(b => b.x + b.width));
            const maxY = Math.max(...boxes.map(b => b.y + b.height));
            
            box = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }
    }

    if (box) {
        this.menuPosition = {
            x: box.x + box.width / 2,
            y: box.y - 10
        };
    }
  }

  isText() {
    return this.selectedShape?.getClassName() === 'Text';
  }

  fontSize() {
    return (this.selectedShape as any)?.fontSize() || 16;
  }

  isBold() {
    const style = ((this.selectedShape as any)?.fontStyle() || '');
    return style.includes('bold');
  }

  isItalic() {
    const style = ((this.selectedShape as any)?.fontStyle() || '');
    return style.includes('italic');
  }

  isUnderline() {
    return (this.selectedShape as any)?.textDecoration() === 'underline';
  }

  duplicate() {
    const targets = this.selectedShape ? [this.selectedShape] : this.selectedShapes;
    if (targets.length === 0) return;

    const newShapes: Konva.Shape[] = [];

    targets.forEach(shape => {
        const clone = shape.clone();
        clone.x(clone.x() + 20);
        clone.y(clone.y() + 20);
        clone.id('shape_' + crypto.randomUUID());

        clone.off(); 
        this.shapesLogic.selectShape(clone);
        this.shapesLogic.onDrawingShape(clone);
        this.shapesLogic.onShapeDragEnd(clone);
        this.shapesLogic.onShapeTransformEnd(clone);
        this.shapesLogic.onShapeAttStyleChange(clone);

        const layer = shape.getLayer();
        layer?.add(clone);
        newShapes.push(clone);
        this.shapeService.addToShapesArray(clone);
    });

    const layer = targets[0].getLayer();
    layer?.batchDraw();

    if (newShapes.length === 1) {
        this.shapeService.setKonvaShape(newShapes[0]);
    } else {
        this.shapeService.setKonvaShape(null);
        this.shapeService.setSelectedShapes(newShapes);
        this.konvaHandler?.updateSelection(null); 
    }
  }

  delete() {
    const targets = this.selectedShape ? [this.selectedShape] : this.selectedShapes;
    if (targets.length === 0) return;
    
    const layer = targets[0].getLayer();
    
    targets.forEach(shape => {
        shape.destroy();
    });

    this.shapeService.setKonvaShape(null);
    this.shapeService.setSelectedShapes([]);
    this.konvaHandler?.updateSelection(null);
    layer?.batchDraw();
  }

  toggleStyle(type: 'bold' | 'italic' | 'underline') {
    if (!this.selectedShape || !this.isText()) return;
    
    if (type === 'underline') {
      const current = (this.selectedShape as any).textDecoration();
      (this.selectedShape as any).textDecoration(current === 'underline' ? '' : 'underline');
    } else {
      let style = (this.selectedShape as any).fontStyle() || 'normal';
      let hasBold = style.includes('bold');
      let hasItalic = style.includes('italic');

      if (type === 'bold') hasBold = !hasBold;
      if (type === 'italic') hasItalic = !hasItalic;

      let newStyle = 'normal';
      if (hasBold && hasItalic) newStyle = 'italic bold';
      else if (hasBold) newStyle = 'bold';
      else if (hasItalic) newStyle = 'italic';

      (this.selectedShape as any).fontStyle(newStyle);
    }
    this.selectedShape.getLayer()?.batchDraw();
  }

  updateFontSize(val: any) {
    if (!this.selectedShape || !this.isText()) return;
    
    const size = Number(val);
    if (!isNaN(size) && size > 0) {
      (this.selectedShape as any).fontSize(size);
      this.selectedShape.getLayer()?.batchDraw();
    }
  }
}