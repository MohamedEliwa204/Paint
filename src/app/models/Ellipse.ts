import { Shape } from "./Shape";
import { ShapeStyles } from "./Shape";
export class Ellipse extends Shape {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    constructor(id: number, cx: number, cy: number, rx: number, ry: number, shapeStyles: ShapeStyles) {
        super(id, "ellipse", shapeStyles);
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
    }

    override getSVG(): string {
        return `<ellipse id=${this.id} cx=${this.cx} cy=${this.cy} rx=${this.rx} ry=${this.ry} ${this.stylesToAttribute()} />`
    }

    override getXML(): string {
        return this.getSVG();
    }

    override getProps(): any {
        return {
            id: this.id,
            type: this.type,
            cx: this.cx,
            cy: this.cy,
            rx: this.rx,
            ry: this.ry,
            shapeStyles: this.shapeStyles
        }
    }
}