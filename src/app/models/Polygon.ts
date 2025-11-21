import { Shape } from "./Shape";
import { ShapeStyles } from "./Shape";
export class Polygon extends Shape {
    points: { x: number, y: number }[];

    constructor(id: number, points: { x: number, y: number }[], shapeStyles: ShapeStyles) {
        super(id, "polygon", shapeStyles);
        this.points = points;
    }

    override getSVG(): string {
        const pointsAttr = this.points.map(p => `${p.x},${p.y}`).join(" ");
        return `<polygon id=${this.id} points="${pointsAttr}" ${this.stylesToAttribute()} />`;
    }

    override getXML(): string {
        return this.getSVG();
    }

    override getProps(): any {
        return {
            id: this.id,
            type: this.type,
            points: this.points,
            shapeStyles: this.shapeStyles
        };
    }
}