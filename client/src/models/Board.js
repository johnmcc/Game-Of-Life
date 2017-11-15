var PubSub = require("../helpers/PubSub");
var get = require("lodash/get");
var forEach = require("lodash/foreach");

var Board = function(){
	this.state = [];
	this.resetState();
}

Board.prototype = {
	resetState: function(){
		clearInterval(this.interval);
		this.state = [];
		for(var i=0; i<=19; i++){
			// Create a row full of 20 false values
			var row = Array.apply(null, Array(20)).map(function(){ return false });
			this.state.push(row);
		}
	},

	toggleElement: function(event){
		var row = event.detail.row;
		var column = event.detail.column;
		this.state[row][column] = !this.state[row][column];
	},

	getActiveNeighbours: function(row, column){
		// We're using lodash's `get` here to grab the values of each cell's
		// neighbours, as it doesn't throw an error if the cell we try to get is
		// undefined. Nice!
		var neighbours = [
			// get the values from the three cells in the row above...
			get(this.state, [row - 1, column - 1], undefined),
			get(this.state, [row - 1, column], undefined),
			get(this.state, [row - 1, column + 1], undefined),

			// and the value to each side of the cell
			get(this.state, [row, column - 1], undefined),
			get(this.state, [row, column + 1], undefined),

			// and the values from the next row
			get(this.state, [row + 1, column - 1], undefined),
			get(this.state, [row + 1, column], undefined),
			get(this.state, [row + 1, column + 1], undefined),
		];

		// Strip out false and undefined, leave only true values.
		// Then, return the number of trues that are left
		return neighbours.filter(function(cell){ return cell; }).length;
	},

	mutate: function(){
		var newState = [];
		forEach(this.state, function(row, rowIndex){
			newState[rowIndex] = [];

			forEach(row, function(cell, cellIndex){
				var numNeighbours = this.getActiveNeighbours(rowIndex, cellIndex);
				var newVal = false;

				if(cell && (numNeighbours === 2 || numNeighbours === 3)){
					newVal = true;
				}else if(!cell && numNeighbours === 3){
					newVal = true;
				}

				newState[rowIndex].push(newVal);
			}.bind(this));
		}.bind(this));

		this.state = newState;
	},

	populateRandom: function(){
		var newState = [];
		forEach(this.state, function(row, rowIndex){
			newState[rowIndex] = [];
			forEach(row, function(cell, cellIndex){
				var newVal = Math.random() > 0.7 ? true:false;
				newState[rowIndex].push(newVal);
			});
		});
		this.state = newState;
	}
};

module.exports = Board;
