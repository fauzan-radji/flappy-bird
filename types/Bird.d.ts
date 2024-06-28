import { type Vec2d } from "kanvasgl";
export default class Bird {
    #private;
    constructor(position: Vec2d, size?: number);
    reset(): void;
    jump(): void;
    update(): void;
    get position(): Vec2d;
    get size(): number;
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
}
