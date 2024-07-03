import Node, { type SimpleNode } from "./Node";
export type SimpleLayer = SimpleNode[];
export default class Layer {
    #private;
    constructor(nodes: Node[]);
    feedForward(input: Layer): void;
    mutate(rate: number): Layer;
    toJSON(): SimpleLayer;
    get nodes(): Node[];
    static create(nodes: SimpleLayer): Layer;
}
