/**
 * The class responsible for drawing text before the game starts and after it ends.
 */
class GUI
{
    #visibility = 255;

	/**
	 * Draws text on the canvas, based on the game state.
     * 
     * @param {Object} data Object with `victory`, `time` and `state` fields,
     *     providing if the player won, game time and its state.
	 */
    draw({victory, time, state}) {
        push();
        textAlign(CENTER);
        if (state != Game.STATE.FINISHED) {
            if (state == Game.STATE.ONGOING && this.#visibility > 0)
                this.#visibility -= 16;

            fill(255, this.#visibility);
            noStroke();
            textSize(map(width, 200, 1000, 20, 40));
            text("Press any button on the keyboard.", 0, height / 2, width, height);
        } else {
            if (this.#visibility < 255)
                this.#visibility += 16;

            noStroke();
            textSize(map(width, 200, 1000, 40, 100));
            fill(victory ? 0 : 255, victory ? 204 : 0, 51, this.#visibility);
            text(victory ? "You won" : "Game over", width / 2, height / 2)
            fill(255, this.#visibility);
            textSize(map(width, 200, 1000, 20, 50));
            text(`${(time / 1000)} s`, width / 2, height / 2 * 1.2);
        }
        pop();
    }
}
