import type Kanvas from "kanvasgl";
import Bird from "./Bird";
export default class Game {
    #private;
    constructor(canvas: Kanvas);
    reset(): void;
    save(): void;
    load(): void;
    update(deltaTime: number): void;
    render(): void;
    renderNetwork(canvas: Kanvas): void;
    get bird(): Bird;
    get isOver(): boolean;
}
