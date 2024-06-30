import Rectangle from "./Rectangle";
export default class Pipe {
    #private;
    constructor(x: number, y: number);
    update(deltaTime: number, speed: number): void;
    nextIfThereIsSpaceTo(rightBorder: number): Pipe | null;
    get left(): number;
    get right(): number;
    get top(): Rectangle;
    get bottom(): Rectangle;
    static set TOP_BOUNDARY(value: number);
    static set BOTTOM_BOUNDARY(value: number);
    static get SIZE(): number;
}
