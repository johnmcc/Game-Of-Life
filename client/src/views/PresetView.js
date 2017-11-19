var PubSub = require("../helpers/PubSub");

var PresetView = function(){
	this.element = document.getElementById("presets");

	this.attachListeners();
};

PresetView.prototype = {
	attachListeners: function(){
		PubSub.subscribe("/presets", this.render.bind(this));
	},

	render: function(event){
		var presets = event.detail;
		for(var i = 0; i<presets.length; i++){
			var preset = presets[i];
			var p = document.createElement("p");

			var a = document.createElement("a");
			a.dataset.index = i;
			a.innerText = preset.name;
			a.href = "#";
			a.addEventListener("click", this.handlePresetClick.bind(this));

			p.appendChild(a);
			this.element.appendChild(p);
		}
	},

	handlePresetClick: function(event){
		event.preventDefault();
		PubSub.publish("/preset/selected", parseInt(event.target.dataset.index, 10));
	}

};

module.exports = PresetView;
