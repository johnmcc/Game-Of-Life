var PubSub = require("../helpers/PubSub");

var GameView = function(){
	this.element = document.getElementById("game");

	this.attachListeners();
};

GameView.prototype = {
	attachListeners: function(){
		// when the board state "ticks", update the board
		PubSub.subscribe("/game/board", this.render.bind(this));
	},
	render: function(event){
		var state = event.detail;
		this.element.innerHTML = "";

		for(var arr of state){
			for(var cell of arr){
				var div = document.createElement("div");
				var cellClass = cell ? "cell-on":"cell-off";
				div.classList.add("cell", cellClass);

				this.element.append(div);
			}
		}
	}
};

module.exports = GameView;
