var GameView = require("./GameView");
var FormView = require("./FormView");
var AudioView = require("./AudioView");

var AppView = function(){

};

AppView.prototype = {
	render: function(){
		new GameView();
		new FormView();
		new AudioView();
	}
};

module.exports = AppView;
