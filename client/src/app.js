var AppView = require("./views/AppView");
var Game = require("./models/Game");

window.addEventListener("load", function(){
	// Render the app
	var appview = new AppView();
	appview.render();

	// Set up the model
	new Game();
});
