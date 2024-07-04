import { type Vec2d } from "kanvasgl";
import Rectangle from "./Rectangle";
import type Brain from "./Brain";
export default class Bird extends Rectangle {
    #private;
    constructor({ position, size, brain, }: {
        position: Vec2d;
        size?: number;
        brain: Brain | undefined;
    });
    reset(): void;
    jump(): void;
    update(): void;
    incrementScore(): void;
    get normalizedVelocity(): number;
    get size(): number;
    get score(): number;
    get brain(): Brain | null;
}
