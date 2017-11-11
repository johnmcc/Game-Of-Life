var PubSub = require("../helpers/PubSub");

var GameView = function(){
	this.element = document.getElementById("game");

	this.attachListeners();
};

GameView.prototype = {
	attachListeners: function(){
		// when the board state "ticks", update the board
		PubSub.subscribe("/game/board", this.render.bind(this));

		this.element.addEventListener("click", this.handleClick.bind(this));
	},
	render: function(event){
		var state = event.detail;
		this.element.innerHTML = "";

		for(var arr of state){
			for(var cell of arr){
				var div = document.createElement("div");
				if(cell){
					div.classList.add("cell", "cell-on");
				}else{
					div.classList.add("cell");
				}

				this.element.append(div);
			}
		}
	},
	handleClick: function(event){
		var clicked = event.target;
		clicked.classList.toggle("cell-on");

		var all = document.querySelectorAll(".cell");
		var index = Array.prototype.indexOf.call(all, clicked);

		var row = parseInt(index / 20, 10);
		var column = index - (row * 20);

		PubSub.publish("/gameview/toggleelement", {
			row: row,
			column: column
		});
	}
};

module.exports = GameView;
