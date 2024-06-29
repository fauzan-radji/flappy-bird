import { Vec2d } from "kanvasgl";
export default class Pipe {
    #private;
    constructor(x: number, y: number);
    update(deltaTime: number, speed: number): void;
    nextIfThereIsSpaceTo(rightBorder: number): Pipe | null;
    get left(): number;
    get right(): number;
    get bottomOfTopPart(): number;
    get topOfBottomPart(): number;
    get position(): Vec2d;
    static set TOP_BOUNDARY(value: number);
    static set BOTTOM_BOUNDARY(value: number);
    static get SIZE(): number;
}
