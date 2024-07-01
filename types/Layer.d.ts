import Node from "./Node";
export default class Layer {
    #private;
    constructor(size: number, bias?: number);
    get nodes(): Node[];
}
