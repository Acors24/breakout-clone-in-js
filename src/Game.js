/**
 * The class responsible for managing all of the game elements.
 */
class Game {
	#shots = [];
	#platform = new Platform(this.#shots);
	#ball = new Ball();
	#bricks = [];
	#mods = [];
	static STATE = Game.#createEnum(["NOT_STARTED", "ONGOING", "FINISHED"]);
	#state = Game.STATE.NOT_STARTED;
	#background = new Background();
	#GUI = new GUI();
	#startTime = 0;
	#endTime = 0;

	/**
	 * Creates new game object.
	 */
	constructor() {
		const brickWidth = 50;
		const brickHeight = 20;
		const offset = (width / 2) % brickWidth + brickWidth / 2;
		for (let y = 0; y < height / brickHeight / 3; y++)
			for (let x = offset; x < width - brickWidth / 2 - (y % 2 * brickWidth); x += brickWidth)
				this.#bricks.push(new Brick(x + (brickWidth / 2) * (y % 2), (y + 1) * brickHeight, brickWidth, brickHeight));
	}

	/**
	 * Updates all game elements.
	 *     If the game hasn't started yet, it starts it with any button press (excluding the PC power button).
	 *     If the game has ended due to the ball falling below the bottom border, nothing happens.
	 */
	update() {
		if (this.#state == Game.STATE.NOT_STARTED && keyIsPressed) {
			this.#state = Game.STATE.ONGOING;
			this.#startTime = Date.now();
		}

		if (this.#state != Game.STATE.ONGOING) return;

		let i = this.#platform.update(this.#mods);
		if (i != -1) {
			let deleted = this.#mods.splice(i, 1)[0];
			switch (deleted.type) {
				case 0: this.#platform.changeWidth(20); break;
				case 1: this.#platform.changeWidth(-20); break;
				case 2: this.#platform.shotsLeft += 10; break;
				case 3: this.#ball.changeSpeed(1.25); break;
				case 4: this.#ball.changeSpeed(0.8); break;
				case 5: this.#platform.changeSpeed(1.25); break;
				case 6: this.#platform.changeSpeed(0.8); break;
			}
		}

		i = this.#ball.update([this.#platform, ...this.#bricks]);
		if (i == -1 || this.#bricks.length == 0) {
			this.#state = Game.STATE.FINISHED;
			this.#endTime = Date.now();
			return;
		}

		if (i > 0) {
			let deleted = this.#bricks.splice(i - 1, 1)[0];
			if (Math.random() < 0.25)
				this.#mods.push(new Mod(deleted.pos.x, deleted.pos.y));
		}
		for (let i = 0; i < this.#mods.length; i++) {
			this.#mods[i].update();
			if (this.#mods[i].pos.y > height)
				this.#mods.splice(i--, 1);
		}

		for (let i = 0; i < this.#shots.length; i++) {
			if (this.#shots[i].pos.y < 0) {
				this.#shots.splice(i--, 1);
				continue;
			}
			let deletedIndex = this.#shots[i].update(this.#bricks);
			if (deletedIndex != -1) {
				let deleted = this.#bricks.splice(deletedIndex, 1)[0];
				this.#shots.splice(i--, 1);
				if (Math.random() < 0.25)
					this.#mods.push(new Mod(deleted.pos.x, deleted.pos.y));
			}
		}
	}

	/**
	 * Draws all game elements on the canvas.
	 */
	draw() {
		for (let obj of [this.#background, this.#platform, this.#ball, ...this.#shots, ...this.#bricks, ...this.#mods])
			obj.draw();

		this.#GUI.draw({
			victory: this.#bricks.length == 0,
			time: this.#endTime - this.#startTime,
			state: this.#state
		});
	}

	/**
	 * Checks if the given circle collides with the given rectangle.
	 * 
	 * @param {Object} circle The circle.
	 * @param {Object} rectangle The rectangle.
	 * @returns {number} A number indicating which area of the rectangle the circle collides with.
	 *     *0* - no collision.
	 *     odd number - upper area.
	 *     even number - bottom area.
	 *     < 8 - left area.
	 *     >= 8 - right area.
	 * @static
	 */
	static circleRectangleCollision(circle, rectangle) {
		let borders = rectangle.borders();

		borders = {
			top: borders[0] - circle.radius,
			bottom: borders[1] + circle.radius,
			left: borders[2] - circle.radius,
			right: borders[3] + circle.radius
		};
		let result = 0;
		if (this.intersects(circle.prevPos, circle.pos, { x: borders.left, y: borders.top }, { x: borders.right, y: borders.top }))
			result |= 1;
		if (this.intersects(circle.prevPos, circle.pos, { x: borders.left, y: borders.bottom }, { x: borders.right, y: borders.bottom }))
			result |= 2;
		if (this.intersects(circle.prevPos, circle.pos, { x: borders.left, y: borders.top }, { x: borders.left, y: borders.bottom }))
			result |= 4;
		if (this.intersects(circle.prevPos, circle.pos, { x: borders.right, y: borders.top }, { x: borders.right, y: borders.bottom }))
			result |= 8;

		/* 0000 - no collision
		 * xxx1 - upper
		 * xx1x - lower
		 * x1xx - left
		 * 1xxx - right
		 */
		return result;
	}

	// https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
	/**
	 * Knowing points *p*, *q* and *r* are colinear, checks if point *q* lies on the *pr* segment.
	 * 
	 * @param {Object} p Point *p*.
	 * @param {Object} q Point *q*.
	 * @param {Object} r Point *r*.
	 * @returns `true` if point *q* lies on the *pr* segment, `false` otherwise.
	 * @private
	 * @static
	 * @ignore
	 */
	static onSegment(p, q, r) {
		if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
			q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
			return true;

		return false;
	}

	/**
	 * Finds the orientation of points *p*, *q* and *r*.
	 * 
	 * @param {Object} p Point *p*.
	 * @param {Object} q Point *q*.
	 * @param {Object} r Point *r*.
	 * @returns 0 - if the given points are colinear.
	 *     -1 - if the given points are oriented counter-clockwise.
	 *     1 - if the given points are oriented clockwise.
	 * @private
	 * @static
	 * @ignore
	 */
	static orientation(p, q, r) {
		let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
		if (val == 0) return 0;
		return (val < 0) ? -1 : 1;
	}

	/**
	 * Checks if segments *p1q1* and *p2q2* intersect.
	 * 
	 * @param {Object} p1 Point *p1*.
	 * @param {Object} q1 Point *q1*.
	 * @param {Object} p2 Point *p2*.
	 * @param {Object} q2 Point *q2*.
	 * @returns `true` if the given segments intersect, `false` otherwise.
	 * @private
	 * @static
	 * @ignore
	 */
	static intersects(p1, q1, p2, q2) {
		let o1 = this.orientation(p1, q1, p2);
		let o2 = this.orientation(p1, q1, q2);
		let o3 = this.orientation(p2, q2, p1);
		let o4 = this.orientation(p2, q2, q1);

		// General case
		if (o1 != o2 && o3 != o4)
			return true;

		// Special cases
		// p1, q1 and p2 are colinear and p2 lies on segment p1q1
		if (o1 == 0 && this.onSegment(p1, p2, q1)) return true;

		if (o2 == 0 && this.onSegment(p1, q2, q1)) return true;

		if (o3 == 0 && this.onSegment(p2, p1, q2)) return true;

		if (o4 == 0 && this.onSegment(p2, q1, q2)) return true;

		return false; // No intersection
	}

	// https://masteringjs.io/tutorials/fundamentals/enum
	/**
	 * Creates an enum object, using the given values.
	 * 
	 * @param {Array} values Array of values used to create the enum.
	 * @returns The enum object
	 * @private
	 * @static
	 * @ignore
	 */
	static #createEnum(values) {
		const enumObject = {};
		for (const val of values) {
			enumObject[val] = val;
		}
		return Object.freeze(enumObject);
	}
}
