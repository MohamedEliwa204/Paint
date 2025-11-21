import { ShapeStyles } from "./Shape";
import { Ellipse } from "./Ellipse";
export class Circle extends Ellipse {
    constructor(id: number, cx: number, cy: number, r: number, shapeStyles: ShapeStyles) {
        super(id, cx, cy, r, r, shapeStyles);
        this.type = "circle";
    }
    override getSVG(): string {
        return `<circle id=${this.id} cx=${this.cx} cy=${this.cy} r=${this.rx} ${this.stylesToAttribute()} />`;
    }

    override getProps(): any {
        return {
            id: this.id,
            type: this.type,
            cx: this.cx,
            cy: this.cy,
            r: this.rx,
            shapeStyles: this.shapeStyles
        }
    }
}