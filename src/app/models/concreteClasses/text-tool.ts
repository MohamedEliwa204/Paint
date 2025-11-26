import Konva from 'konva';
import { ShapesLogic } from '../../components/drawing-canvas/shapes-logic';

export class TextTool {
  constructor(private shapeLogic: ShapesLogic) {}

  addText(layer: Konva.Layer) {
    const textNode = new Konva.Text({
      x: 50,
      y: 50,
      text: 'Double click to edit', 
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      draggable: true,
      name: 'text-shape',
      type: 'text' 
    });

    this.shapeLogic.selectShape(textNode);
    this.shapeLogic.onDrawingShape(textNode);
    this.shapeLogic.onShapeDragEnd(textNode);
    this.shapeLogic.onShapeTransformEnd(textNode);
    this.shapeLogic.onShapeAttStyleChange(textNode);

    textNode.on('dblclick dbltap', () => {
      this.handleTextEdit(textNode, layer.getStage());
    });

    layer.add(textNode);
    layer.batchDraw();
  }

  private handleTextEdit(textNode: Konva.Text, stage: Konva.Stage | null) {
    if (!stage) return;

    textNode.hide(); 
    
    const textPosition = textNode.absolutePosition();
    const areaPosition = {
      x: stage.container().offsetLeft + textPosition.x,
      y: stage.container().offsetTop + textPosition.y,
    };

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = (textNode.width() - textNode.padding() * 2) + 50 + 'px'; 
    textarea.style.height = textNode.height() + 20 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = '1px dashed #3b82f6';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.background = 'white';
    textarea.style.outline = 'none';
    textarea.style.color = textNode.fill() as string;
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.textAlign = textNode.align();

    const rotation = textNode.rotation();
    if (rotation) {
      textarea.style.transform = `rotateZ(${rotation}deg)`;
    }
    
    textarea.focus();

    const removeTextarea = () => {
      textarea.parentNode?.removeChild(textarea);
      textNode.show();
      stage.batchDraw();
    };

    const handleOutsideClick = (e: any) => {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        removeTextarea();
        window.removeEventListener('click', handleOutsideClick);
      }
    };

    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        textNode.text(textarea.value);
        removeTextarea();
        window.removeEventListener('click', handleOutsideClick);
      }
      if (e.key === 'Escape') {
        removeTextarea();
        window.removeEventListener('click', handleOutsideClick);
      }
    });

    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  }
}