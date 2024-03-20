/**
 * An item shot out by the platform, causing the destruction of the brick it collides with.
 * @extends Circle
 */
class Shot extends Circle {
	#speed = createVector(0, -10);
	
	/**
	 * Creates a new shot with the given coordinates.
	 * 
	 * @param {number} x *x* coordinate of the new shot.
	 * @param {number} y *y* coordinate of the new shot.
	 */
	constructor(x, y) {
		const radius = 2;
		super(x, y, radius);
	}
	
	/**
	 * Updates the shot based on its speed and checks if it collides with any of the given rectangles.
	 * 
	 * @param {Array} bricks Array of rectangles to check for collisions with.
	 * @returns {number} Index of the rectangle in the given array, which the shot is colliding with. *-1* if there is no collision.
	 */
	update(bricks) {
		this.pos.add(this.#speed);
		for (let i in bricks) {
			const borders = bricks[i].borders();
			if (this.pos.x > borders[2] && this.pos.x < borders[3] && this.pos.y < borders[1])
			    return i;
		}
		return -1;
	}
	
	/**
	 * Draws the shot on the canvas, based on its position.
	 */
	draw() {
		push();
		noStroke();
		fill(255, 255, 64);
		ellipse(this.pos.x, this.pos.y, this.radius * 2);
		pop();
	}
}
