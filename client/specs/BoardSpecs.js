var assert = require("assert");
var Board = require("../src/models/Board");

describe("Game", function(){
	var board;

	beforeEach(function(){
		board = new Board();
	});

	it("should have an initial state of length 20", function(){
		assert.strictEqual(board.state.length, 20);
	});

	it("should be able to get the correct number of neighbours", function(){
		board.state = [
			[false, true, false],
			[false, true, false],
			[false, true, false]
		];

		// row 1, column 0
		assert.strictEqual(board.getActiveNeighbours(0, 0), 2);

		// row 1, column 1 (zero-indexed)
		assert.strictEqual(board.getActiveNeighbours(1, 1), 2);

    // row 2, column 1
		assert.strictEqual(board.getActiveNeighbours(2, 1), 1);
	});

	it("should be able to mutate the state correctly", function(){
		board.state = [
			[false, true, false],
			[false, true, false],
			[false, true, false]
		];

		board.mutate();

		var expected = [
			[false, false, false],
			[true, true, true],
			[false, false, false],
		];

		assert.deepEqual(board.state, expected);
	});
});
