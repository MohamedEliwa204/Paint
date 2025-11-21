export type ShapeType = "circle" | "ellipse" | "square" | "rect" | "line" | "polygon";
export type ShapeStyles = {
    stroke?: string,
    strokeWidth?: number,
    fill?: string,
    opacity?: number,
    strokeDashArray?: string,
    [key: string]: any
}
export interface ShapeJSON {
    id: number;
    type: string;
    shapeStyles: ShapeStyles;
    x?: number;      // rectangle / square
    y?: number;
    width?: number;  // rectangle / square
    height?: number;
    cx?: number;     // ellipse / circle
    cy?: number;
    rx?: number;     // ellipse
    ry?: number;
    r?: number;      // circle
    x1?: number;     // line
    y1?: number;
    x2?: number;
    y2?: number;
    points?: { x: number, y: number }[]; // polygon
}

export abstract class Shape {
    id: number;
    type: ShapeType;
    shapeStyles: ShapeStyles

    constructor(
        id: number,
        type: ShapeType,
        shapeStyles: ShapeStyles
    ) {
        this.id = id;
        this.type = type;
        this.shapeStyles = shapeStyles
    }

    abstract getSVG(): string;
    abstract getProps(): ShapeJSON;
    abstract getXML(): string;

    protected stylesToAttribute() {
        return Object.entries(this.shapeStyles).map(([key, value]) => `${this.toKebabCase(key)}="${value}"`).join(" ");
    }

    protected toKebabCase(str: string) {
        return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
    }

}