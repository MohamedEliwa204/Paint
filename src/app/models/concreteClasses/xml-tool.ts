import Konva from 'konva';
import { ShapesLogic } from '../../components/drawing-canvas/shapes-logic';
import { ShapeSelection } from '../../services/shape-selection';

export class XmlTool {
  
  constructor(
    private shapeLogic: ShapesLogic,
    private shapeService: ShapeSelection
  ) {}

  async exportCanvas() {
    const layer = this.shapeService.getMainLayer();
    if (!layer) return;

    this.shapeService.setKonvaShape(null);
    this.shapeService.setSelectedShapes([]);
    
    const systemNodes = layer.getChildren().filter(node => 
      node.getClassName() === 'Transformer' || node.name() === 'selectionRectangle'
    );
    systemNodes.forEach(node => node.remove());

    const jsonObject = layer.toObject();
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n` + this.jsonToXml(jsonObject);

    systemNodes.forEach(node => layer.add(node));

    const blob = new Blob([xmlString], { type: 'application/xml' });
    const filename = `whiteboard-data-${new Date().toISOString().slice(0, 10)}.xml`;

    try {
        if ('showSaveFilePicker' in window) {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName: filename,
                types: [{ description: 'XML File', accept: { 'application/xml': ['.xml'] } }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } else {
            throw new Error("Not supported");
        }
    } catch (err) {
        if ((err as any).name !== 'AbortError') {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }
    layer.batchDraw();
  }

  importCanvas(file: File) {
    const layer = this.shapeService.getMainLayer();
    if (!layer || !file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const xmlContent = e.target.result;

      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
        const rootElement = xmlDoc.documentElement;

        if (rootElement.nodeName !== 'Layer') {
            throw new Error("Invalid XML: Root must be Layer");
        }

        const layerConfig = this.xmlToJson(rootElement);

        const existingChildren = layer.getChildren().slice();
        existingChildren.forEach(child => {
            if (child.getClassName() !== 'Transformer' && child.name() !== 'selectionRectangle') {
                child.destroy();
            }
        });

        if (layerConfig.children) {
            layerConfig.children.forEach((childConfig: any) => {
                const node = Konva.Node.create(childConfig);
                
                if (node.getClassName() === 'Transformer' || node.name() === 'selectionRectangle') return;

                node.moveTo(layer);
                this.rebindEvents(node);
            });
        }

        this.shapeService.setKonvaShape(null);
        this.shapeService.setSelectedShapes([]);
        layer.batchDraw();

      } catch (error) {
        console.error("XML Parse Error:", error);
        alert("Failed to load XML file.");
      }
    };

    reader.readAsText(file);
  }

  private jsonToXml(node: any): string {
    let xml = `<${node.className}`;

    if (node.attrs) {
        for (const [key, value] of Object.entries(node.attrs)) {
            let strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            strValue = strValue.replace(/"/g, '&quot;');
            xml += ` ${key}="${strValue}"`;
        }
    }

    if (node.children && node.children.length > 0) {
        xml += '>';
        node.children.forEach((child: any) => {
            xml += this.jsonToXml(child);
        });
        xml += `</${node.className}>`;
    } else {
        xml += '/>';
    }

    return xml;
  }

  private xmlToJson(element: Element): any {
    const config: any = {
        className: element.nodeName,
        attrs: {},
        children: []
    };

    if (element.attributes) {
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            config.attrs[attr.name] = this.parseValue(attr.value);
        }
    }

    if (element.children) {
        for (let i = 0; i < element.children.length; i++) {
            config.children.push(this.xmlToJson(element.children[i]));
        }
    }

    return config;
  }

  private parseValue(val: string): any {
    if (!val) return val;
    
    if ((val.startsWith('[') && val.endsWith(']')) || (val.startsWith('{') && val.endsWith('}'))) {
        try {
            return JSON.parse(val);
        } catch { }
    }

    const num = Number(val);
    if (!isNaN(num) && val.trim() !== '') {
        return num;
    }

    if (val === 'true') return true;
    if (val === 'false') return false;

    return val;
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
        
        this.shapeLogic.selectShape(node);
        this.shapeLogic.onDrawingShape(node);
        this.shapeLogic.onShapeDragEnd(node);
        this.shapeLogic.onShapeTransformEnd(node);
    }
  }
}