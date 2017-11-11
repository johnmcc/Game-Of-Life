var PubSub = require("../helpers/PubSub");

var Game = function(){
	// Create initial board state - for each row (20)
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
	resetState: function(){
		this.state = [];
		for(var i=0; i<=19; i++){
			// Create a row full of 20 false values
			var row = Array.apply(null, Array(20)).map(function(){ return false });
			this.state.push(row);
		}
		this.publish();
	},

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
		PubSub.subscribe("/form/start", function(event){
			this.interval = setInterval(this.tick.bind(this), this.speed);
		}.bind(this));

		PubSub.subscribe("/form/stop", function(event){
			clearInterval(this.interval);
		}.bind(this));

		PubSub.subscribe("/form/reset", function(event){
			clearInterval(this.interval);
			this.resetState();
		}.bind(this));

		PubSub.subscribe("/form/changespeed", function(event){
			this.speed = event.detail;
			clearInterval(this.interval);
		}.bind(this));
	}
};

module.exports = Game;
