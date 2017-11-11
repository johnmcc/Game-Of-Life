var PubSub = require("../helpers/PubSub");

var FormView = function(){
	this.form = document.querySelector("form");
	this.startBtn = document.getElementById("start");
	this.stopBtn = document.getElementById("stop");
	this.speedSlider = document.getElementById("speed");

	this.attachListeners();
};

FormView.prototype = {
	attachListeners: function(){
		// cancel the form submission
		this.form.addEventListener("submit", this.nerfForm);

		// hook up the start button
		this.startBtn.addEventListener("click", this.handleStartClick);

		// ...and the stop button
		this.stopBtn.addEventListener("click", this.handleStopClick);

		// ...and the speed
		this.speedSlider.addEventListener("change", this.handleSpeedChange);
	},
	nerfForm: function(event){
		event.preventDefault();
	},
	handleStartClick: function(event){
		PubSub.publish("/form/start");
	},
	handleStopClick: function(event){
		PubSub.publish("/form/stop");
	},
	handleSpeedChange: function(event){
		PubSub.publish("/form/changespeed", event.target.value);
	}
};

module.exports = FormView;
