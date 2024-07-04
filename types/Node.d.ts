import Edge, { type SimpleEdge } from "./Edge";
export interface SimpleNode {
    edges: SimpleEdge[];
    bias: number;
}
export default class Node {
    #private;
    constructor(edges: Edge[], bias?: number);
    feedForward(input: Node[]): void;
    mutate(rate: number): Node;
    toJSON(): SimpleNode;
    set value(value: number);
    get value(): number;
    get bias(): number;
    get edges(): Edge[];
    static create({ bias, edges }: SimpleNode): Node;
}
