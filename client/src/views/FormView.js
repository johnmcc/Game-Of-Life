var PubSub = require("../helpers/PubSub");

var FormView = function(){
	this.form = document.querySelector("form");
	this.startBtn = document.getElementById("start");
	this.stopBtn = document.getElementById("stop");
	this.resetBtn = document.getElementById("reset");
	this.randomBtn = document.getElementById("random");
	this.speedSlider = document.getElementById("speed");
	this.speedDisplay = document.getElementById("speedDisplay");

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

		// ...and the reset button
		this.resetBtn.addEventListener("click", this.handleResetClick);

		// ...and the random button
		this.randomBtn.addEventListener("click", this.handleRandomClick);

		// ...and the speed
		this.speedSlider.addEventListener("change", this.handleSpeedChange);
		this.speedSlider.addEventListener("input", this.handleSlide.bind(this));
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
	handleResetClick: function(event){
		PubSub.publish("/form/reset");
	},
	handleRandomClick: function(event){
		PubSub.publish("/form/random");
	},
	handleSpeedChange: function(event){
		PubSub.publish("/form/changespeed", event.target.value);
	},
	handleSlide: function(event){
		var speed = event.target.value;
		this.speedDisplay.innerText = "Tick Speed: " + speed + "ms";
	}
};

module.exports = FormView;
