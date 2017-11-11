var PubSub = require("../helpers/PubSub");

var Game = function(){
	this.state = [];

	for(var i=0; i<=19; i++){
		this.state.push([]);
	}

	PubSub.publish("/game/board", this.state);

	setInterval(this.tick.bind(this), 1000);
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

		PubSub.publish("/game/board", this.state);
	}
};

module.exports = Game;
