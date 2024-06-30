import { type Vec2d } from "kanvasgl";
import Rectangle from "./Rectangle";
export default class Bird extends Rectangle {
    #private;
    constructor(position: Vec2d, size?: number);
    reset(): void;
    jump(): void;
    update(): void;
    incrementScore(): void;
    get size(): number;
    get score(): number;
}
