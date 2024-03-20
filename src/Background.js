/**
 * The background of the game area.
 */
class Background {
	#tiles = [];
	
	/**
	 * Creates the tiles visible in the background.
	 */
	constructor() {
		for (let i = 0; i < 400; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height;
			const tileWidth = 200 + Math.random() * 200;
			const tileHeight = 50 + Math.random() * 50;
			this.#tiles.push([x, y, tileWidth, tileHeight]);
		}
		this.#tiles.sort((a, b) => b[1] - a[1]);
	}

	/**
	 * Draws the background on the canvas, based on the tiles made earlier.
	 */
	draw() {
		push();
		noStroke();
		rectMode(CENTER);
		for (let p of this.#tiles) {
			fill(map(p[1], 0, height, -51, 153));
			rect(p[0], p[1], p[2], p[3]);
		}
		pop();
	}
}
