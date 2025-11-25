import { ShapeDto, ShapeType } from '../dtos/shape.dto';
import { ShapeStyles } from '../dtos/shape.dto';

// Deprecated classes don't use them 
// They are kept for backward compatibility
// and may be removed in future versions
// Use Konva shapes instead
// They introduced initialy for svg but currently 
// Konva is used for rendering shapes
export abstract class BaseShape implements ShapeDto {

  id: string;
  type: string;


  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number; // degrees

  shapeStyles: ShapeStyles;

  isSelected?: boolean;
  metadata?: Record<string, unknown>;
  protected _dragOffset?: { x: number; y: number }; // because i use it in all children classes
  protected _resizeOffset?: { x: number; y: number };

  protected _resizeStart?: { x: number; y: number; width: number; height: number };
  protected _activeResizeHandle?: string | null;

  protected constructor(dto: ShapeDto) {

    this.id = dto.id;
    this.type = dto.type;
    this.x = dto.x ?? 0;
    this.y = dto.y ?? 0;
    this.width = dto.width ?? 0;
    this.height = dto.height ?? 0;
    this.rotation = dto.rotation;

    this.shapeStyles = dto.shapeStyles ?? ({} as ShapeStyles);


    this.isSelected = dto.isSelected;
    this.metadata = dto.metadata;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  resize(dw: number, dh: number) {
    this.width = Math.max(0, this.width + dw);
    this.height = Math.max(0, this.height + dh);
  }

  startDrag(poniterX: number, pointerY: number) {
    this._dragOffset = { x: poniterX - this.x, y: pointerY - this.y };
  }

  dragTo(pointerX: number, pointerY: number) {
    if (!this._dragOffset) {
      return
    }
    this.x = pointerX - this._dragOffset.x;
    this.y = pointerY - this._dragOffset.y;
  }

  endDrag() {
    this._dragOffset = undefined;
  }

  protected stylesToAttribute() {
    return Object.entries(this.shapeStyles).map(([key, value]) => `${this.toKebabCase(key)}="${value}"`).join(" ");
  }

  protected toKebabCase(str: string) {
    return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
  }

  abstract applyPositionToElement(el: SVGGraphicsElement): void;

  abstract getSVG(): string;

  abstract getProps(): ShapeDto;

  abstract getXML(): string;

  abstract containsPoint(pointX: number, pointY: number): boolean;

  /**
   * Start resize: remember original bounds and active handle.
   * handle: one of 'nw','n','ne','e','se','s','sw','w' or null.
   */
  startResize(pointX: number, pointY: number, handle: string | null): void {
    this._activeResizeHandle = handle;
    this._resizeStart = { x: this.x, y: this.y, width: this.width, height: this.height };
    this._resizeOffset = { x: pointX, y: pointY };

  };

  resizing(pointX: number, pointY: number): void {
    if (!this._resizeStart || !this._activeResizeHandle) {
      return
    }
    const start = this._resizeStart;
    const handle = this._activeResizeHandle;
    //helpers
    const setLeft = () => {
      const newLeft = Math.min(pointX, start.x + start.width);
      const newWidth = Math.max(0, start.x + start.width - newLeft);
      this.x = newLeft;
      this.width = newWidth;
    };
    const setRight = () => {
      const newWidth = Math.max(0, pointX - start.x);
      this.x = start.x;
      this.width = newWidth;
    };
    const setTop = () => {
      const newTop = Math.min(pointY, start.y + start.height);
      const newHeight = Math.max(0, start.y + start.height - newTop);
      this.y = newTop;
      this.height = newHeight;
    };
    const setBottom = () => {
      const newHeight = Math.max(0, pointY - start.y);
      this.y = start.y;
      this.height = start.height;
    };
    switch (handle) {
      case 'nw':
        setLeft();
        setTop();
        break;
      case 'n':
        setTop();
        break;
      case 'ne':
        setRight();
        setTop();
        break;
      case 'e':
        setRight();
        break;
      case 'se':
        setRight();
        setBottom();
        break;
      case 's':
        setBottom();
        break;
      case 'sw':
        setLeft();
        setBottom();
        break;
      case 'w':
        setLeft();
        break;
      default:

        break;
    }
    ;


  };

  endResizing(): void {
    this._resizeStart = undefined;
    this._activeResizeHandle = undefined;
    this._resizeOffset = undefined;
  }
}
