import Node from "./Node";
export default class Edge {
    #private;
    constructor(from: Node, to: Node, weight: number);
    get from(): Node;
    get to(): Node;
    get weight(): number;
}
