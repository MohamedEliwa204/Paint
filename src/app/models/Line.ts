import { Shape } from "./Shape";
import { ShapeStyles } from "./Shape";
export class Line extends Shape {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    constructor(
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        shapeStyles: ShapeStyles
    ) {
        super(id, "line", shapeStyles);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    override getSVG(): string {
        return `<line id=${this.id} x1=${this.x1} y1=${this.y1} x2=${this.x2} y2=${this.y2} ${this.stylesToAttribute()} />`;
    }

    override getXML(): string {
        return `<line id=${this.id} x1=${this.x1} y1=${this.y1} x2=${this.x2} y2=${this.y2} ${this.stylesToAttribute()} />`;
    }

    override getProps(): any {
        return {
            id: this.id,
            type: this.type,
            x1: this.x1,
            y1: this.y1,
            x2: this.x2,
            y2: this.y2,
            shapeStyles: this.shapeStyles
        };
    }
}