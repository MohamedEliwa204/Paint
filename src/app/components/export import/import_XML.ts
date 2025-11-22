import { LineShape } from '../../models/concreteClasses/line-shape';
import { RectangleShape } from '../../models/concreteClasses/rectangle-shape';
import { SquareShape } from '../../models/concreteClasses/square-shape';
import { EllipseShape } from '../../models/concreteClasses/ellipse-shape';
import { CircleShape } from '../../models/concreteClasses/circle-shape';
import { ShapeStyles } from '../../models/dtos/shape.dto';
import { BaseShape } from '../../models/concreteClasses/base-shape';
import { PolygonShape } from '../../models/concreteClasses/polygon-shape';
const defaultStyleKeys = ["stroke", "strokeWidth", "fill", "opacity", "strokeDashArray"];
export class ImportXML {
    import(xml: string) {
        let tagsArray = xml.split("\n");
        if (tagsArray[0] != `<?xml version="1.0" encoding="ISO-8859-1"?>`) throw new Error("Invalid xml");
        if (tagsArray[1] != `<shapes>` || tagsArray[tagsArray.length - 1] != `</shapes>`) throw new Error("Invalid xml");
        let shapes: BaseShape[] = [];
        for (let i = 2; i < tagsArray.length - 1; i++) {
            let tag = tagsArray[i];
            shapes.push(this.tagToShape(tag));
        }
        console.log(shapes)
        return shapes;
    }

    tagToShape(tag: string): any {
        if (!tag.startsWith("<") || !tag.endsWith("/>")) throw new Error("Invalid tag" + tag);
        tag = tag.substring(1, tag.length - 2);
        let parts = tag.split(" ");
        let type = parts[0];
        switch (type) {
            case "line": return this.parseLine(parts);
            case "rect": return this.parseRect(parts);
            case "square": return this.parseSquare(parts);
            case "ellipse": return this.parseEllipse(parts);
            case "circle": return this.parseCircle(parts);
            case "polygon": return this.parsePolygon(parts);
            default: throw new Error("invalid type" + parts.join(" "))
        }
    }

    parseLine(parts: string[]) {
        let id = parts.find(part => part.startsWith("id="))?.split("=")[1].replace(/['"]/g, "");
        let x1 = parts.find(part => part.startsWith("x1="))?.split("=")[1];
        let y1 = parts.find(part => part.startsWith("y1="))?.split("=")[1];
        let x2 = parts.find(part => part.startsWith("x2="))?.split("=")[1];
        let y2 = parts.find(part => part.startsWith("y2="))?.split("=")[1];
        if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined || id === undefined) {
            throw new Error("Invalid line tag" + parts.join(" "));
        }
        let startIndex = parts.findIndex(part => defaultStyleKeys.includes(part.split("=")[0]));
        let shapeStyles = this.parseStyles(parts.slice(startIndex))
        return new LineShape({
            id: id,
            type: 'line',
            x1: parseFloat(x1),
            y1: parseFloat(y1),
            x2: parseFloat(x2),
            y2: parseFloat(y2),
            shapeStyles: shapeStyles
        });
    }

    parseRect(parts: string[]) {
        let id = parts.find(part => part.startsWith("id="))?.split("=")[1].replace(/['"]/g, "");
        console.log(id)
        console.log(id?.length)

        let x = parts.find(part => part.startsWith("x="))?.split("=")[1];
        let y = parts.find(part => part.startsWith("y="))?.split("=")[1];
        let width = parts.find(part => part.startsWith("width="))?.split("=")[1];
        let height = parts.find(part => part.startsWith("height="))?.split("=")[1];
        if (id === undefined || x === undefined || y === undefined || height === undefined || width === undefined)
            throw new Error("Invalid Rectangle tag" + parts.join(" "));
        let startIndex = parts.findIndex(part => defaultStyleKeys.includes(part.split("=")[0]));
        let shapeStyles = this.parseStyles(parts.slice(startIndex))
        const rectangle = new RectangleShape({
            id: id,
            type: 'rectangle',
            x: parseFloat(x),
            y: parseFloat(y),
            width: parseFloat(width),
            height: parseFloat(height),
            shapeStyles: shapeStyles
        });
        return rectangle;
    }

    parseSquare(parts: string[]) {
        let id = parts.find(part => part.startsWith("id="))?.split("=")[1].replace(/['"]/g, "");
        console.log(id)
        console.log(id?.length)

        console.log(parseFloat(id?.trim()!))
        console.log(parts)

        let x = parts.find(part => part.startsWith("x="))?.split("=")[1];
        let y = parts.find(part => part.startsWith("y="))?.split("=")[1];
        let width = parts.find(part => part.startsWith("width="))?.split("=")[1];
        let height = parts.find(part => part.startsWith("height="))?.split("=")[1];
        if (id === undefined || x === undefined || y === undefined || height === undefined || width === undefined)
            throw new Error("Invalid Square tag" + parts.join(" "));
        let startIndex = parts.findIndex(part => defaultStyleKeys.includes(part.split("=")[0]));
        let shapeStyles = this.parseStyles(parts.slice(startIndex))
        return new SquareShape(
            {
                id: id,
                type: 'square',
                x: parseFloat(x),
                y: parseFloat(y),
                width: parseFloat(width),
                height: parseFloat(height),
                shapeStyles: shapeStyles
            }
        );
    }

    parseEllipse(parts: string[]) {
        let id = parts.find(part => part.startsWith("id="))?.split("=")[1].replace(/['"]/g, "");
        console.log(id)
        console.log(id?.length)
        console.log(parseFloat(id?.trim()!))
        let cx = parts.find(part => part.startsWith("cx="))?.split("=")[1];
        let cy = parts.find(part => part.startsWith("cy="))?.split("=")[1];
        let rx = parts.find(part => part.startsWith("rx="))?.split("=")[1];
        let ry = parts.find(part => part.startsWith("ry="))?.split("=")[1];
        if (id === undefined || cx === undefined || cy === undefined || ry === undefined || rx === undefined)
            throw new Error("Invalid Ellipse tag" + parts.join(" "));
        let startIndex = parts.findIndex(part => defaultStyleKeys.includes(part.split("=")[0]));
        let shapeStyles = this.parseStyles(parts.slice(startIndex))
        return new EllipseShape(
            {
                id: id,
                type: 'ellipse',
                cx: parseFloat(cx),
                cy: parseFloat(cy),
                rx: parseFloat(rx),
                ry: parseFloat(ry),
                shapeStyles
            })
    }

    parseCircle(parts: string[]) {
        let id = parts.find(part => part.startsWith("id="))?.split("=")[1].replace(/['"]/g, "");
        console.log(id)
        console.log(parseFloat(id?.trim()!))
        console.log("circle parts")
        console.log(parts)

        let cx = parts.find(part => part.startsWith("cx="))?.split("=")[1];
        let cy = parts.find(part => part.startsWith("cy="))?.split("=")[1];
        let r = parts.find(part => part.startsWith("r="))?.split("=")[1];
        if (id === undefined || cx === undefined || cy === undefined || r === undefined)
            throw new Error("Invalid Circle tag" + parts.join(" "));
        let startIndex = parts.findIndex(part => defaultStyleKeys.includes(part.split("=")[0]));
        let shapeStyles = this.parseStyles(parts.slice(startIndex))
        return new CircleShape(
            {
                id: id,
                type: 'circle',
                cx: parseFloat(cx),
                cy: parseFloat(cy),
                r: parseFloat(r),
                shapeStyles: shapeStyles
            }
        );
    }

    private parsePolygon(parts: string[]): PolygonShape {
        // --- Extract id ---
        const rawId = parts.find(p => p.startsWith("id="));
        const idStr = rawId?.split("=")[1].replace(/['"]/g, "");
        if (!idStr) throw new Error("Invalid polygon tag: missing id");
        const id = parseInt(idStr);

        // --- FIX BROKEN POINTS SPLIT ---
        const pointsStartIndex = parts.findIndex(p => p.startsWith("points="));
        if (pointsStartIndex === -1) {
            throw new Error("Invalid polygon tag: missing points");
        }

        let pointsParts = [];
        for (let i = pointsStartIndex; i < parts.length; i++) {
            pointsParts.push(parts[i]);
            // Stop when you reach a part ending with a quote
            if (parts[i].endsWith('"') || parts[i].endsWith("'")) break;
        }

        // Join back into one string
        const rawPoints = pointsParts.join(" ");

        // Extract only the value inside the quotes
        const pointsValue = rawPoints.split("=")[1].replace(/['"]/g, "");

        // Convert "x,y x,y x,y" → array
        const points = pointsValue.split(" ").map(pair => {
            const [x, y] = pair.split(",").map(Number);
            return { x, y };
        });

        const startIndex = parts.findIndex(p => defaultStyleKeys.includes(p.split("=")[0]));
        let shapeStyles = {};
        if (startIndex !== -1) {
            shapeStyles = this.parseStyles(parts.slice(startIndex));
        }

        return new PolygonShape({
            id: idStr,
            type: 'polygon',
            points: points,
            shapeStyles: shapeStyles
        });
    }

    parseStyles(parts: string[]): ShapeStyles {
        let styles: ShapeStyles = {};
        for (const part of parts) {
            let [key, value] = [part.split("=")[0], part.split("=")[1]];
            styles[this.kebabToCamel(key)] = this.parseValue([key, value]);
        }
        return styles;
    }

    parseValue(obj: any) {
        if (obj[0] == "") return;
        const [key, value] = obj;
        if (value == undefined) console.log(undefined)
        let cleanValue = value.replace(/['"]/g, "");
        let camelKey = this.kebabToCamel(key);
        switch (camelKey) {
            case "stroke":
            case "fill":
            case "strokeDashArray":
                return cleanValue;
            case "strokeWidth":
            case "opacity":
                const num = parseFloat(cleanValue);
                if (isNaN(num)) throw new Error(`Invalid number for ${key}: ${cleanValue}`);
                return num;
            default:
                return cleanValue;
        }
    }

    kebabToCamel(str: string): string {
        return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    }


}