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
    resize(width: number, height: number): void;
    reset(): void;
    save(): void;
    load(): void;
    update(deltaTime: number): void;
    render(): void;
    renderNetwork(canvas: Kanvas): void;
    singlePlayer(): void;
    versusAI(): void;
    trainAI(): void;
    pause(): void;
    resume(): void;
    get paused(): boolean;
    get isOver(): boolean;
}
