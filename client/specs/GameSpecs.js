var assert = require("assert");
var Game = require("../src/models/Game");

describe("Game", function(){
	var game;

	beforeEach(function(){
		game = new Game();
	});

	it("should have an initial state of length 20", function(){
		assert.strictEqual(game.state.length, 20);
	});

	it("should be able to get the correct number of neighbours", function(){
		game.state = [
			[false, true, false],
			[false, true, false],
			[false, true, false]
		];

		// row 1, column 0
		assert.strictEqual(game.getActiveNeighbours(0, 0), 2);

		// row 1, column 1 (zero-indexed)
		assert.strictEqual(game.getActiveNeighbours(1, 1), 2);

    // row 2, column 1
		assert.strictEqual(game.getActiveNeighbours(2, 1), 1);
	});

	it("should be able to mutate the state correctly", function(){
		game.state = [
			[false, true, false],
			[false, true, false],
			[false, true, false]
		];

		var expected = [
			[false, false, false],
			[true, true, true],
			[false, false, false],
		];
	});
});
