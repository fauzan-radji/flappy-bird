import { Vec2d, type Point2d } from "kanvasgl";
export default class Rectangle {
    #private;
    constructor(topLeft: Point2d, bottomRight: Point2d);
    reset(): void;
    move(direction: Point2d): void;
    collide(other: Rectangle): boolean;
    get position(): Vec2d;
    get topLeft(): Vec2d;
    get bottomRight(): Vec2d;
    get top(): number;
    get bottom(): number;
    get left(): number;
    get right(): number;
    get x(): number;
    get y(): number;
    get width(): number;
    get height(): number;
}
