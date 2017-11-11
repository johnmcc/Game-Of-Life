/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var AppView = __webpack_require__(1);
var Game = __webpack_require__(3);

window.addEventListener("load", function(){
	// Render the app
	var appview = new AppView();
	appview.render();

	// Set up the model
	new Game();
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var GameView = __webpack_require__(2);
var FormView = __webpack_require__(5);

var AppView = function(){

};

AppView.prototype = {
	render: function(){
		new GameView();
		new FormView();
	}
};

module.exports = AppView;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var PubSub = __webpack_require__(4);

var GameView = function(){
	this.element = document.getElementById("game");

	this.attachListeners();
};

GameView.prototype = {
	attachListeners: function(){
		// when the board state "ticks", update the board
		PubSub.subscribe("/game/board", this.render.bind(this));
	},
	render: function(event){
		var state = event.detail;
		this.element.innerHTML = "";

		for(var arr of state){
			for(var cell of arr){
				var div = document.createElement("div");
				var cellClass = cell ? "cell-on":"cell-off";
				div.classList.add("cell", cellClass);

				this.element.append(div);
			}
		}
	}
};

module.exports = GameView;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var PubSub = __webpack_require__(4);

var Game = function(){
	// Create initial board state - for each row (20)
	this.state = [];
	this.resetState();

	// can be changed by /form/changespeed
	this.speed = 1000;

	// Will store the return value of setInterval, for stopping later
	this.interval;

	// Change the state when events come through
	this.attachListeners();

	// announce that we've created the initial state
	this.publish();
};

Game.prototype = {
	resetState: function(){
		this.state = [];
		for(var i=0; i<=19; i++){
			// Create a row full of 20 false values
			var row = Array.apply(null, Array(20)).map(function(){ return false });
			this.state.push(row);
		}
		this.publish();
	},

	tick: function(){
		var newState = [];

		for(var row of this.state){
			var newRow = [];
			for(var i=0; i<=19; i++){
				newRow[i] = !row[i];
			}
			newState.push(newRow);
		}

		this.state = newState;

		this.publish();
	},

	publish(){
		PubSub.publish("/game/board", this.state);
	},

	attachListeners(){
		PubSub.subscribe("/form/start", function(event){
			this.interval = setInterval(this.tick.bind(this), this.speed);
		}.bind(this));

		PubSub.subscribe("/form/stop", function(event){
			clearInterval(this.interval);
		}.bind(this));

		PubSub.subscribe("/form/reset", function(event){
			clearInterval(this.interval);
			this.resetState();
		}.bind(this));

		PubSub.subscribe("/form/changespeed", function(event){
			this.speed = event.detail;
			clearInterval(this.interval);
		}.bind(this));
	}
};

module.exports = Game;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var PubSub = {
	publish: function(channel, payload){
		var event = new CustomEvent(channel, {
			detail: payload
		});
		document.dispatchEvent(event);
	},

	subscribe: function(channel, callback){
		document.addEventListener(channel, callback);
	}
}

module.exports = PubSub;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var PubSub = __webpack_require__(4);

var FormView = function(){
	this.form = document.querySelector("form");
	this.startBtn = document.getElementById("start");
	this.stopBtn = document.getElementById("stop");
	this.resetBtn = document.getElementById("reset");
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

		// ...and the reset button
		this.resetBtn.addEventListener("click", this.handleResetClick);

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
	handleResetClick: function(event){
		PubSub.publish("/form/reset");
	},
	handleSpeedChange: function(event){
		PubSub.publish("/form/changespeed", event.target.value);
	}
};

module.exports = FormView;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map