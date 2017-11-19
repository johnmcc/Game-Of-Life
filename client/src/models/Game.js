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
	attachListeners(){
		PubSub.subscribe("/form/start", this.start.bind(this));

		PubSub.subscribe("/form/stop", this.stop.bind(this));

		PubSub.subscribe("/form/reset", this.reset.bind(this));

		PubSub.subscribe("/form/random", this.random.bind(this));

		PubSub.subscribe("/form/changespeed", this.changeSpeed.bind(this));

		PubSub.subscribe("/preset/selected", this.selectPreset.bind(this));

		// We have to bind to the board here, so that it can refer to this.state
		PubSub.subscribe("/gameview/toggleelement", this.board.toggleElement.bind(this.board));
	},

	publish(){
		PubSub.publish("/game/board", this.board.state);
	},

	start: function(){
		this.interval = setInterval(this.tick.bind(this), this.speed);
	},

	stop: function(){
		clearInterval(this.interval);
	},

	reset: function(event){
		this.board.resetState();
		this.publish();
	},

	random: function(event){
		this.board.resetState();
		this.board.populateRandom();
		this.publish();
	},

	changeSpeed: function(event){
		this.speed = event.detail;
		if(this.interval){
			clearInterval(this.interval);
			this.start();
		}
	},

	selectPreset: function(event){
		clearInterval(this.interval);
		var index = event.detail;
		this.board.state = this.board.presets[index].state;
		this.publish();
	},

	tick: function(){
		this.board.mutate();
		this.publish();
	}
};

module.exports = Game;
