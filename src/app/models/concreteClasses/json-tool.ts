import Konva from 'konva';
import { ShapesLogic } from '../../components/drawing-canvas/shapes-logic';
import { ShapeSelection } from '../../services/shape-selection';

export class JsonTool {
  
  constructor(
    private shapeLogic: ShapesLogic,
    private shapeService: ShapeSelection
  ) {}

  exportCanvas() {
    const layer = this.shapeService.getMainLayer();
    if (!layer) {
      alert("No active layer found!");
      return;
    }

    this.shapeService.setSelectedShape(null);
    
    const json = layer.toJSON();

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.download = `canvas-drawing-${Date.now()}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importCanvas(file: File) {
    const layer = this.shapeService.getMainLayer();
    if (!layer || !file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const jsonContent = e.target.result;

      try {
        const children = layer.getChildren().slice();
        children.forEach(child => {
            if (child.getClassName() !== 'Transformer') {
                child.destroy();
            }
        });

        const tempNode = Konva.Node.create(jsonContent);
        let shapes: any[] = []; 
        
        if (tempNode.getClassName() === 'Layer') {
           shapes = (tempNode as Konva.Layer).getChildren();
        } else {
           shapes = [tempNode];
        }

        shapes.forEach(shape => {
          if (shape.getClassName() === 'Transformer') {
            return;
          }

          shape.moveTo(layer);

          this.shapeLogic.selectShape(shape);
          this.shapeLogic.onDrawingShape(shape);
          this.shapeLogic.onShapeDragEnd(shape);
          this.shapeLogic.onShapeTransformEnd(shape);
          this.shapeLogic.onShapeAttStyleChange(shape);
        });
        
        layer.batchDraw();

      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Failed to load JSON file.");
      }
    };

    reader.readAsText(file);
  }
}