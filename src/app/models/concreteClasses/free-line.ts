import { ShapeDto } from "../dtos/shape.dto";
import { BaseShape } from "./base-shape";

// FreeLine represents a freehand drawn line with multiple points

// Deprecated classes don't use them 
// They are kept for backward compatibility
// and may be removed in future versions
// Use Konva shapes instead
// They introduced initialy for svg but currently 
// Konva is used for rendering shapes
export class FreeLine extends BaseShape {
    override type = 'free-draw' as const;
    points: { x: number; y: number }[] = [];
    constructor(dto: ShapeDto) {
        super(dto);
    }
    override applyPositionToElement(el: SVGGraphicsElement): void {
        throw new Error("Method not implemented.");
    }
    addPoint(x: number, y: number) {
        this.points.push({ x, y });
    }

    private pointsToPath(): string {
        if (this.points.length < 2) return '';
        let path = `M${this.points[0]} ${this.points[1]}`;
        for (let i = 2; i < this.points.length; i += 2) {
            path += ` L${this.points[i]} ${this.points[i + 1]}`;
        }
        return path;
    }

    override getSVG(): string {
        if (this.points.length < 2) return '';
        const path = this.pointsToPath();
        return `<path id="${this.id}" d="${path}" ${this.stylesToAttribute()} fill="none" />`;
    }

    override getXML(): string {
        return this.getSVG();
    }
    override getProps(): ShapeDto {
        return {
            id: this.id,
            type: this.type,
            shapeStyles: this.shapeStyles,
            points: this.points
        }
    }
    override containsPoint(pointX: number, pointY: number): boolean {
        throw new Error("Method not implemented.");
    }



}