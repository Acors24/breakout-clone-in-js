/**
 * The class representing a circle with a 2D position and a radius.
 */
 class Circle {
	prevPos;
	pos;
	radius;
	
	/**
	 * Creates a new circle with the given coordinates and radius.
	 * 
	 * @param  {number} x The *x* coordinate of the circle's center.
	 * @param  {number} y The *y* coordinate of the circle's center.
	 * @param  {number} radius The circle's radius.
	 */
	constructor(x, y, radius) {
		this.pos = createVector(x, y);
		this.radius = radius;
	}
}
