import Bird from "./Bird.js";
let canvas;
let bird;
export function setup(kanvas) {
    canvas = kanvas;
    canvas.background("skyblue");
    bird = new Bird(canvas.center.copy({ x: 30 }));
}
export function loop() {
    bird.position.add({ x: 0.000000001, y: 0 });
    if (bird.position.x > innerWidth) {
        bird.position.x = 0;
    }
    canvas.clear();
    draw(canvas);
    requestAnimationFrame(loop);
}
export function main() {
    loop();
}
export function draw(canvas) {
    bird.draw(canvas);
}
