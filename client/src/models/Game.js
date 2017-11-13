var PubSub = require("../helpers/PubSub");
var get = require("lodash/get");
var forEach = require("lodash/foreach");

var Game = function(){
	// Create initial board state
	this.state = [];
	this.resetState();

	// can be changed by /form/changespeed
	this.speed = 1000;

	// Will store the return value of setInterval, for stopping later
	this.interval;

	// Change the state when events come through
	this.attachListeners();

	// announce that we've created the initial state
	this.publish();
};

Game.prototype = {
	publish(){
		PubSub.publish("/game/board", this.state);
	},

	attachListeners(){
		PubSub.subscribe("/form/start", function(event){
			this.interval = setInterval(this.tick.bind(this), this.speed);
		}.bind(this));

		PubSub.subscribe("/form/stop", function(event){
			clearInterval(this.interval);
		}.bind(this));

		PubSub.subscribe("/form/reset", function(event){
			this.resetState();
		}.bind(this));

		PubSub.subscribe("/form/changespeed", function(event){
			this.speed = event.detail;
			clearInterval(this.interval);
		}.bind(this));

		PubSub.subscribe("/gameview/toggleelement", this.toggleElement.bind(this));
	},

	resetState: function(){
		clearInterval(this.interval);
		this.state = [];
		for(var i=0; i<=19; i++){
			// Create a row full of 20 false values
			var row = Array.apply(null, Array(20)).map(function(){ return false });
			this.state.push(row);
		}
		this.publish();
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

	tick: function(){
		this.state = this.mutate();
		this.publish();
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

		return newState;
	}
};

module.exports = Game;
