var AppView = require("./views/AppView");
var Board = require("./models/Board");
var Game = require("./models/Game");

window.addEventListener("load", function(){
	// Render the app
	var appview = new AppView();
	appview.render();

	// Set up the model
	var board = new Board();
	new Game(board);
});
