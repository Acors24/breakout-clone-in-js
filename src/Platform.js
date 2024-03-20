/**
 * The platform moving along the bottom edge of the game area.
 * @extends Rectangle
 */
class Platform extends Rectangle {
	#minWidth = 50;
	#maxWidth = width / 3;
	shotsLeft = 0;
	#colorNegative = 0;
	#colorPositive = 0;
	shots;
	#speed = 5;
	#minSpeed = 3;
	#maxSpeed = 20;
	
	/**
	 * Creates a new platform located at the bottom of the game area.
	 * 
	 * @param  {Array} shots Array containing existing shots shot out by the platform.
	 */
	constructor(shots) {
		const x = width / 2;
		const y = height - 20;
		const platformWidth = width / 4 > 150 ? 150 : width / 4;
		const platformHeight = 10;
		super(x, y, platformWidth, platformHeight);
		/** The shot array is shared between the game and the platform */
		this.shots = shots;
	}
	
	/**
	 * Draws the platform on the canvas (and its cannons), based on its color, position and width.
	 */
	draw() {
		push();
		rectMode(CENTER);
		noStroke();
		fill(255 - this.#colorPositive, 255 - this.#colorNegative, 255 - this.#colorNegative - this.#colorPositive);
		rect(this.pos.x, this.pos.y, this.width, this.height);
		if (this.shotsLeft) {
			fill(204, 0, 0);
			const positions = this.cannonPositions();
			rect(positions[0].x, positions[0].y, 5, this.height);
			rect(positions[1].x, positions[1].y, 5, this.height);
		}
		pop();
	}
	
	/**
	 * Updates the color of the platform and its position, and makes the platform shoot, based on the pressed keys.
	 * Also checks if the platform is colliding with any of the mods contained in the given array.
	 * 
	 * @param  {!Array} mods Array of the existing mods.
	 * @returns  {number} Index of the mod colliding with the platform. *-1* if there is no collision.
	 */
	update(mods) {
		if (this.#colorNegative > 0) this.#colorNegative -= 5;
		if (this.#colorPositive > 0) this.#colorPositive -= 5;
		if (keyIsDown(LEFT_ARROW))
			this.pos.x -= this.#speed;
		if (keyIsDown(RIGHT_ARROW))
			this.pos.x += this.#speed;
		if (this.shotsLeft && keyIsPressed && keyCode === UP_ARROW)
			this.shoot();
		
		let modIndex = -1;
		const borders = this.borders();
		for (let i in mods) {
			if (mods[i].pos.y > borders[0] - mods[i].radius &&
			    mods[i].pos.x > borders[2] - mods[i].radius &&
			    mods[i].pos.x < borders[3] + mods[i].radius) {
			    modIndex = i;
				break;
			}
		}
		
		if (borders[2] < 0) this.pos.x = this.width / 2;
		else if (borders[3] > width) this.pos.x = width - this.width / 2;
		
		return modIndex;
	}
	
	/**
	 * Changes the width of the platform by the given number.
	 * 
	 * @param  {number} n The number used to find the new width of the platform.
	 */
	changeWidth(n) {
		this.width += n;
		if (this.width > this.#maxWidth)
			this.width = this.#maxWidth;
		if (this.width < this.#minWidth)
			this.width = this.#minWidth;
		if (n < 0)
			this.#colorNegative = 255;
		else
			this.#colorPositive = 255;
	}
	
	/**
	 * Changes the speed of the platform, based on the given number.
	 * 
	 * @param  {number} n The number indicating the ratio of the new speed to the old speed.
	 */
	changeSpeed(n) {
		this.#speed *= n;
		if (this.#speed < this.#minSpeed)
			this.#speed = this.#minSpeed;
		else if (this.#speed > this.#maxSpeed)
			this.#speed = this.#maxSpeed;
		if (n < 1)
			this.#colorNegative = 255;
		else
			this.#colorPositive = 255;
	}
	
	/**
	 * Finds the positions of the platform's two cannons.
	 * 
	 * @returns {Array} The array containing the cannons' positions.
	 */
	cannonPositions() {
		return [createVector(this.pos.x - this.width / 2 + 5, this.pos.y - this.height / 2),
		        createVector(this.pos.x + this.width / 2 - 5, this.pos.y - this.height / 2)];
	}
	
	/**
	 * Creates a new shot located at one of the platform's cannons.
	 */
	shoot() {
		const positions = this.cannonPositions();
		this.shots.push(new Shot(positions[this.shotsLeft % 2].x, positions[this.shotsLeft % 2].y, 5, this.height));
		this.shotsLeft--;
		keyIsPressed = false;
		keyCode = DOWN_ARROW;
	}
}
