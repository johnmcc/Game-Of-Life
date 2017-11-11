var GameView = require("./GameView.js");

var AppView = function(){

};

AppView.prototype = {
	render: function(){
		new GameView();
	}
};

module.exports = AppView;
