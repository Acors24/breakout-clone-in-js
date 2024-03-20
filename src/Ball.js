/**
 * The ball bouncing off the borders of the game area, bricks (destroying them) and the platform.
 * @extends Circle
 */
class Ball extends Circle {
	#speed = createVector(1, -1).setMag(7);
	#minSpeed = 3;
	#maxSpeed = 15;
	#colorNegative = 0;
	#colorPositive = 0;
	
	/**
	 * Creates a new ball in the middle of the game area.
	 */
	constructor() {
		const x = width / 2;
		const y = height * 0.8;
		const radius = 5;
		super(x, y, radius);
	}

	/**
	 * Draws the ball on the canvas, based on its color and position.
	 */
	draw() {
		push();
		noStroke();
		fill(255 - this.#colorPositive, 255 - this.#colorNegative - this.#colorPositive, 255 - this.#colorNegative);
		ellipse(this.pos.x, this.pos.y, this.radius * 2);
		pop();
	}
	
	/**
	 * Updates the ball's color and position.
	 * Also checks if it's colliding with any object in the given array.
	 * 
	 * @param  {!Array} objs Array of objects to check collisions with.
	 * @returns  {(number|string)} Index of the object the ball is colliding with.
	 *     *-1* if the ball left the game area.
	 *     "no collision" if there is no collision.
	 */
	update(objs) {
		this.prevPos = this.pos.copy();
		if (this.#colorNegative > 0) this.#colorNegative -= 5;
		if (this.#colorPositive > 0) this.#colorPositive -= 5;
		this.pos.add(this.#speed);
		if (this.#checkCollisionWithGameArea() == -1)
			return -1;
		for (let i in objs) {
			if (this.pos.x < objs[i].x - objs[i].width / 2 - this.radius * 2 ||
				this.pos.x < objs[i].x + objs[i].width / 2 + this.radius * 2)
				continue;
				
			const borders = objs[i].borders();
			const info = Game.circleRectangleCollision(this, objs[i]);
			if (info & 3) {
				this.#fixY(borders[0], borders[1], info);
			}
			if (info & 12) {
				this.#fixX(borders[2], borders[3], info);
			}

			if (i == 0 && info & 1)
			{
				const xDistanceToCenter = this.pos.x - objs[i].pos.x;
				const newDirection = map(xDistanceToCenter, -objs[i].width / 2, objs[i].width / 2,
								             Math.PI / 6, 5 * Math.PI / 6);
				this.#speed.setHeading(Math.PI + newDirection);
			}

			if (info != 0) {
				return i;
			}
		}
		return "no collision";
	}
	
	/**
	 * Fixes the horizontal position of the ball, based on its speed and how far it ended up.
	 * 
	 * @param {number} leftEdge Left edge of the colliding object.
	 * @param {number} rightEdge Right edge of the colliding object.
	 * @param {number} info Number indicating which edges took part in the collision.
	 * @private
	 */
	#fixX(leftEdge, rightEdge, info) {
		if (info & 4) {
			if (this.#speed.x > 0) {
				this.pos.x = 2 * leftEdge - 2 * this.radius - this.pos.x;
				this.#speed.x *= -1;
			} else {
				this.pos.x = leftEdge - this.radius - 1;
			}
		}
		if (info & 8) {
			if (this.#speed.x < 0) {
				this.pos.x = 2 * rightEdge + 2 * this.radius - this.pos.x;
				this.#speed.x *= -1;
			} else {
				this.pos.x = rightEdge + this.radius + 1;
			}
		}
	}
	
	/**
	 * Fixes the vertical position of the ball, based on its speed and how far it ended up.
	 * 
	 * @param {number} topEdge Top edge of the colliding object.
	 * @param {number} bottomEdge Bottom edge of the colliding object.
	 * @private
	 */
	#fixY(topEdge, bottomEdge, info) {
		if (info & 1) {
			if (this.#speed.y > 0) {
				this.pos.y = 2 * topEdge - 2 * this.radius - this.pos.y;
				this.#speed.y *= -1;
			} else {
				this.pos.y = topEdge - this.radius - 1;
			}
		}
		if (info & 2) {
			if (this.#speed.y < 0) {
				this.pos.y = 2 * bottomEdge + 2 * this.radius - this.pos.y;
				this.#speed.y *= -1;
			} else {
				this.pos.y = bottomEdge + this.radius + 1;
			}
		}
	}
	
	/**
	 * Changes the speed of the ball, based on the given number.
	 * 
	 * @param  {number} n The number indicating the ratio of the new speed to the old speed.
	 */
	changeSpeed(n) {
		this.#speed.mult(n);
		if (this.#speed.magSq() < this.#minSpeed * this.#minSpeed)
			this.#speed.setMag(this.#minSpeed);
		if (this.#speed.magSq() > this.#maxSpeed * this.#maxSpeed)
			this.#speed.setMag(this.#maxSpeed);
		if (n < 1)
			this.#colorPositive = 255;
		else
			this.#colorNegative = 255;
	}
	
	/**
	 * Checks for collisions with the game area. If there are any, fixes the position based on how far the ball ended up.
	 * 
	 * @returns {number} *0* if the ball hasn't crossed the bottom edge of the game area.
	 *     *-1* if the ball crossed the bottom edge of the game area.
	 * @private
	 */
	#checkCollisionWithGameArea() {
		if (this.pos.x > width - this.radius || this.pos.x < this.radius) {
			if (this.#speed.x > 0)
				this.pos.x = 2 * width - 2 * this.radius - this.pos.x;
			else
				this.pos.x = 2 * this.radius - this.pos.x;
			
			this.#speed.x *= -1;
		}
		if (this.pos.y > height - this.radius || this.pos.y < this.radius) {
			if (this.#speed.y > 0) {
				return -1;
			}
			else
				this.pos.y = 2 * this.radius - this.pos.y;
			
			this.#speed.y *= -1;
		}
		return 0;
	}
}
