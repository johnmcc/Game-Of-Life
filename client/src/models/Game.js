var PubSub = require("../helpers/PubSub");

var Game = function(board){
	this.board = board;

	// can be changed by /form/changespeed
	this.speed = 250;

	// Will store the return value of setInterval, for stopping later
	this.interval;

	// Change the state when events come through
	this.attachListeners();

	// announce that we've created the initial state
	this.publish();
};

Game.prototype = {
	publish(){
		PubSub.publish("/game/board", this.board.state);
	},

	attachListeners(){
		PubSub.subscribe("/form/start", function(event){
			this.start();
		}.bind(this));

		PubSub.subscribe("/form/stop", function(event){
			clearInterval(this.interval);
		}.bind(this));

		PubSub.subscribe("/form/reset", function(event){
			this.board.resetState();
			this.publish();
		}.bind(this));

		PubSub.subscribe("/form/random", function(event){
			this.board.resetState();
			this.board.populateRandom();
			this.publish();
		}.bind(this));

		PubSub.subscribe("/form/changespeed", function(event){
			this.speed = event.detail;
			if(this.interval){
				clearInterval(this.interval);
				this.start();
			}
		}.bind(this));

		PubSub.subscribe("/preset/selected", function(event){
			clearInterval(this.interval);
			var index = event.detail;
			this.board.state = this.board.presets[index].state;
			this.publish();
		}.bind(this));

		// We have to bind to the board here, so that it can refer to this.state, for example
		PubSub.subscribe("/gameview/toggleelement", this.board.toggleElement.bind(this.board));
	},

	start: function(){
		this.interval = setInterval(this.tick.bind(this), this.speed);
	},

	tick: function(){
		this.board.mutate();
		this.publish();
	}
};

module.exports = Game;
