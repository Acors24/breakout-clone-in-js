let game;

function setup() {
	const borderWidth = getComputedStyle(document.querySelector("canvas")).borderTopWidth.replace("px", "");
	createCanvas(windowWidth - borderWidth * 2, windowHeight - borderWidth * 2);
	game = new Game();
}

function draw() {
	game.update();
	game.draw();
}
