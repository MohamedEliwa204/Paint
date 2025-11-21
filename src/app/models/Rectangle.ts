import { Shape } from "./Shape";
import { ShapeStyles } from "./Shape";
export class Rectangle extends Shape {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(id: number, x: number, y: number, width: number, height: number, shapeStyles: ShapeStyles) {
        super(id, "rect", shapeStyles);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    override getSVG() {
        return `<rect id=${this.id} x=${this.x} y=${this.y} width=${this.width} height=${this.height} ${this.stylesToAttribute()} />`
    }

    override getXML() {
        return this.getSVG();
    }

    override getProps() {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            shapeStyles: this.shapeStyles
        }
    }
}