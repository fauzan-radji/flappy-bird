import Edge from "./Edge";
import type Layer from "./Layer";
export default class Level {
    #private;
    constructor(inputLayer: Layer, outputLayer: Layer);
    feedForward(): void;
    get inputLayer(): Layer;
    get outputLayer(): Layer;
    get edges(): Edge[];
}
