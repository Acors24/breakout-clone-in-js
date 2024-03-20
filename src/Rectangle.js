/**
 * The class representing a rectangle with a 2D position, width and height.
 */
class Rectangle {
	pos;
	width;
	height;
	
	/**
	 * Creates a new rectangle with the given coordinates and dimensions.
	 * 
	 * @param  {number} x *x* coordinate of the rectangle's center.
	 * @param  {number} y *y* coordinate of the rectangle's center.
	 * @param  {number} width The width of the rectangle.
	 * @param  {number} height The height of the rectangle.
	 */
	constructor(x, y, width, height) {
		this.pos = createVector(x, y);
		this.width = width;
		this.height = height;
	}
	
	/**
	 * @returns  {Array} An array containing the Y coordinates of the top and bottom edges and the X coordinates of the left and right edges.
	 */
	borders() {
		return [this.pos.y - this.height  / 2,
		        this.pos.y + this.height  / 2,
		        this.pos.x - this.width / 2,
		        this.pos.x + this.width / 2];
	}
}
