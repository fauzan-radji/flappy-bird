export default class Bird {
    #initialPosition;
    #position;
    #size = 10;
    #velocity = -10;
    #maxVelocity = 40;
    constructor(position, size) {
        this.#initialPosition = position;
        this.#position = position.copy();
        if (size)
            this.#size = size;
    }
    reset() {
        this.#position.set(this.#initialPosition);
        this.#velocity = -10;
    }
    jump() {
        if (this.#velocity < 0)
            return;
        this.#velocity = -10;
    }
    update() {
        this.#velocity = Math.min(this.#velocity + 0.5, this.#maxVelocity);
        this.#position.add({ x: 0, y: this.#velocity });
    }
    get position() {
        return this.#position;
    }
    get size() {
        return this.#size;
    }
}
