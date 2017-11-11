var GameView = require("./GameView");
var FormView = require("./FormView");

var AppView = function(){

};

AppView.prototype = {
	render: function(){
		new GameView();
		new FormView();
	}
};

module.exports = AppView;
