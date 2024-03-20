/**
 * A brick with random saturation changing with time, and hue based on its 2D position.
 * @extends Rectangle
 */
class Brick extends Rectangle {
	#s = Math.random() * Math.PI * 2;

	/**
	 * Creates a new brick with the given coordinates and dimensions.
	 * 
	 * @param {number} x The *x* coordinate of the new brick.
	 * @param {number} y The *y* coordinate of the new brick.
	 * @param {number} brick_width The width of the new brick.
	 * @param {number} brick_height The height of the new brick.
	 */
	constructor(x, y, brick_width, brick_height) {
		super(x, y, brick_width, brick_height);
	}

	/**
	 * Draws the brick on the canvas, based on its position, dimensions and color.
	 */
	draw() {
		this.#s += 0.025;
		push();
		rectMode(CENTER);
		noStroke();
		colorMode(HSB, width, 100, 100);
		fill((this.pos.x + 2 * this.pos.y) % width, 70 + Math.sin(this.#s) * 30, 100);
		rect(this.pos.x, this.pos.y, this.width, this.height);
		pop();
	}
}
