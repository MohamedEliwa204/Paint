import Konva from 'konva';
import { ShapesLogic } from '../../components/drawing-canvas/shapes-logic';

export class ImageTool {
  constructor(private shapeLogic: ShapesLogic) {}

  uploadImage(e: Event, layer: Konva.Layer) {
    const input = e.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (event: any) => {
        const imgObj = new Image();
        imgObj.src = event.target.result; 
        
        imgObj.onload = () => {
          this.createKonvaImage(imgObj, layer);
        };
      };
      
      reader.readAsDataURL(input.files[0]);
    }
  }

  private createKonvaImage(imgObj: HTMLImageElement, layer: Konva.Layer) {
    const maxInitialSize = 300; 
    const scale = Math.min(
        maxInitialSize / imgObj.width, 
        maxInitialSize / imgObj.height, 
        1
    );

    const imageNode = new Konva.Image({
      x: 50,          
      y: 50,
      image: imgObj,     
      width: imgObj.width * scale,
      height: imgObj.height * scale,
      draggable: true,   
      name: 'image-shape',
      type: 'image'     
    });

    this.shapeLogic.selectShape(imageNode);
    this.shapeLogic.onDrawingShape(imageNode);
    this.shapeLogic.onShapeDragEnd(imageNode);
    this.shapeLogic.onShapeTransformEnd(imageNode);
    layer.add(imageNode);
    layer.batchDraw();
  }
}