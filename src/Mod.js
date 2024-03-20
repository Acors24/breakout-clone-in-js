/**
 * An item which changes the characteristics of the ball or the platform, after being caught with the latter. Has a chance of spawning after destroying a brick.
 * @extends Circle
 */
class Mod extends Circle {
	#speed;
	acc = createVector(0, 0.05);
	type;
	static amountOfTypes = 7;
	
	/**
	 * Creates a new mod with the given coordinates.
	 * 
	 * @param {number} x *x* coordinate of the mod.
	 * @param {number} y *y* coordinate of the mod.
	 */
	constructor(x, y) {
		const radius = 5;
		super(x, y, radius);
		this.#speed = p5.Vector.random2D();
		this.#speed.y *= Math.sign(this.#speed.y);
		this.type = Math.floor(Math.random() * Mod.amountOfTypes);
	}
	
	/**
	 * Updates
	 *  - the speed of the mod, based on its acceleration
	 *  - the position of the mod, based on its speed.
	 */
	update() {
		this.prevPos = this.pos.copy();
		this.#speed.add(this.acc);
		this.pos.add(this.#speed);
		if (this.pos.x < 0) this.#speed.x *= -1;
		if (this.pos.x > width) this.#speed.x *= -1;
	}
	
	/**
	 * Draws the mod on the canvas, based on its color and position.
	 */
	draw() {
		push();
		noStroke();
		colorMode(HSB);
		fill(2 * frameCount % 720, 100, 100);
		ellipse(this.pos.x, this.pos.y, this.radius * 2);
		pop();
	}
}
