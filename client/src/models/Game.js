var PubSub = require("../helpers/PubSub");

var Game = function(){
	this.state = [];

	// Will store the return value of setInterval, for stopping later
	this.interval;

	// Create initial board state - for each row (20)
	for(var i=0; i<=19; i++){
		// Create a row full of 20 false values
		var row = Array.apply(null, Array(20)).map(function(){ return false });
		this.state.push(row);
	}

	// announce that we've created the initial state
	this.publish();
	this.attachListeners();
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
	},
	attachListeners(){
		PubSub.subscribe("/form/start", function(){
			this.interval = setInterval(this.tick.bind(this), 750);
		}.bind(this));

		PubSub.subscribe("/form/stop", function(){
			clearInterval(this.interval);
		}.bind(this));
	}
};

module.exports = Game;
