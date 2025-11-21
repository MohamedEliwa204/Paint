import { Rectangle } from "./Rectangle";
import { Shape, ShapeStyles } from "./Shape";
export class Square extends Rectangle {
    // TODO : implement getters and setters to ensure correctness 
    constructor(id: number, x: number, y: number, side: number, shapeStyles: ShapeStyles) {
        super(id, x, y, side, side, shapeStyles);
        this.type = "square";
    }

    override getXML(): string {
        return `<square id=${this.id} x=${this.x} y=${this.y} side=${this.height} ${this.stylesToAttribute()} />`
    }

}