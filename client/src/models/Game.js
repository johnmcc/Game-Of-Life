var PubSub = require("../helpers/PubSub");

var Game = function(){
	this.state = [];

	// Create initial board state - for each row (20)
	for(var i=0; i<=19; i++){
		// Create a row full of 20 false values
		var row = Array.apply(null, Array(20)).map(function(){ return false });
		this.state.push(row);
	}

	// announce that we've created the initial state
	this.publish();
};

Game.prototype = {
	tick: function(){
		var newState = [];

		for(var row of this.state){
			var newRow = [];
			for(var i=0; i<=19; i++){
				newRow[i] = !row[i];
			}
			newState.push(newRow);
		}

		this.state = newState;

		this.publish();
	},
	publish(){
		PubSub.publish("/game/board", this.state);
	}
};

module.exports = Game;
