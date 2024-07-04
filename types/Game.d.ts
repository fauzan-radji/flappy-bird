import type Kanvas from "kanvasgl";
export declare enum GAME_MODE {
    TRAIN = 0,
    TEST = 1,
    COMPETE = 2,
    PLAY = 3
}
export default class Game {
    #private;
    constructor(canvas: Kanvas, brainString: string);
    reset(): void;
    save(): void;
    load(): void;
    update(deltaTime: number): void;
    render(): void;
    renderNetwork(canvas: Kanvas): void;
    get isOver(): boolean;
}
