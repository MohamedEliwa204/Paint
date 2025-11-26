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
    if (!layer) return;

    this.shapeService.setKonvaShape(null);
    this.shapeService.setSelectedShapes([]);
    
    const systemNodes = layer.getChildren().filter(node => 
      node.getClassName() === 'Transformer' || node.name() === 'selectionRectangle'
    );

    systemNodes.forEach(node => node.remove());

    const json = layer.toJSON();

    systemNodes.forEach(node => layer.add(node));

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const date = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    link.download = `whiteboard-backup-${date}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    layer.batchDraw();
  }

  importCanvas(file: File) {
    const layer = this.shapeService.getMainLayer();
    if (!layer || !file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const jsonContent = e.target.result;

      try {
        const existingChildren = layer.getChildren().slice();
        existingChildren.forEach(child => {
            if (child.getClassName() !== 'Transformer' && child.name() !== 'selectionRectangle') {
                child.destroy();
            }
        });

        const tempNode = Konva.Node.create(jsonContent);
        let newShapes: Konva.Node[] = [];

        if (tempNode.getClassName() === 'Layer') {
             newShapes = (tempNode as Konva.Layer).getChildren().slice();
        } else {
             newShapes = [tempNode]; 
        }

        newShapes.forEach(shape => {
            if (shape.getClassName() === 'Transformer' || shape.name() === 'selectionRectangle') {
                return;
            }

            shape.moveTo(layer);
            this.rebindEvents(shape);
        });

        this.shapeService.setKonvaShape(null);
        this.shapeService.setSelectedShapes([]);
        
        layer.batchDraw();

      } catch (error) {
        console.error(error);
        alert("Failed to load JSON file.");
      }
    };

    reader.readAsText(file);
  }

  private rebindEvents(node: Konva.Node) {
    if (node.name() === 'eraser') {
        node.draggable(false); 
        return; 
    }

    if (node.getParent() instanceof Konva.Group) {
        node.draggable(false); 
    } else {
        node.draggable(true);
        
        this.shapeLogic.selectShape(node);
        this.shapeLogic.onDrawingShape(node);
        this.shapeLogic.onShapeDragEnd(node);
        this.shapeLogic.onShapeTransformEnd(node);
        this.shapeLogic.onShapeAttStyleChange(node);
    }

    if (node instanceof Konva.Group) {
        (node as Konva.Group).getChildren().forEach(child => {
             this.rebindEvents(child); 
        });
    }
  }
}