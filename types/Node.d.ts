export default class Node {
    #private;
    constructor(bias: number);
    set value(value: number);
    get value(): number;
    get bias(): number;
}
