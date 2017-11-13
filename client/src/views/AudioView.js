var Tone = require("Tone");
var PubSub = require("../helpers/PubSub");
var forEach = require("lodash/foreach");
var flattenDeep = require("lodash/flattenDeep");

var AudioView = function(){
	this.polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();

	this.attachListeners();
};

AudioView.prototype = {
	attachListeners: function(){
		PubSub.subscribe("/game/board", function(event){
			var board = event.detail;
			this.play(this.convertBoardToSound(board));
		}.bind(this));
	},

	convertBoardToSound: function(board){
		var board = flattenDeep(event.detail);

		var notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5"];

		var noteOccurrences = {};

		forEach(board, function(cell, index){
			if(cell){
				if(index >= notes.length){
					index = index % (notes.length - 1)
				}

				var note = notes[index];

				if(noteOccurrences.hasOwnProperty(note)){
					noteOccurrences[note] = noteOccurrences[note] + 1;
				}else{
					noteOccurrences[note] = 1;
				}
			}
		});
		var sorted = Object.keys(noteOccurrences).sort(function(a, b){return noteOccurrences[b] - noteOccurrences[a]})

		return {
			notes: sorted.slice(0, 4),
			length: "8n"
		};
	},

	play: function(chord_info){
		this.polySynth.triggerAttackRelease(chord_info.notes, chord_info.length);
	}
};

module.exports = AudioView;
