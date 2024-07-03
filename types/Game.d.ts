import type Kanvas from "kanvasgl";
export default class Game {
    #private;
    constructor(canvas: Kanvas, brainString: string);
    reset(): void;
    save(): void;
    load(brainString: string): void;
    update(deltaTime: number): void;
    render(): void;
    renderNetwork(canvas: Kanvas): void;
    get isOver(): boolean;
}
