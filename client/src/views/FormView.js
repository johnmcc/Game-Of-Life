var PubSub = require("../helpers/PubSub");

var FormView = function(){
	this.form = document.querySelector("form");
	this.startBtn = document.getElementById("start");
	this.stopBtn = document.getElementById("stop");

	this.attachListeners();
};

FormView.prototype = {
	attachListeners: function(){
		this.form.addEventListener("submit", this.nerfForm);

		// hook up start button
		this.startBtn.addEventListener("click", this.handleStartClick);

		// ...and the stop button
		this.stopBtn.addEventListener("click", this.handleStopClick);
	},
	nerfForm: function(event){
		event.preventDefault();
	},
	handleStartClick: function(event){
		PubSub.publish("/form/start");
	},
	handleStopClick: function(event){
		PubSub.publish("/form/stop");
	}
};

module.exports = FormView;
