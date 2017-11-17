var GameView = require("./GameView");
var FormView = require("./FormView");
var AudioView = require("./AudioView");
var PresetView = require("./PresetView");

var AppView = function(){

};

AppView.prototype = {
	render: function(){
		new GameView();
		new FormView();
		new AudioView();
		new PresetView();
	}
};

module.exports = AppView;
