import type Kanvas from "kanvasgl";
import Bird from "./Bird";
export default class Game {
    #private;
    constructor(canvas: Kanvas);
    reset(): void;
    update(): void;
    render(): void;
    get bird(): Bird;
    get isOver(): boolean;
}
