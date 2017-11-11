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

var AppView = function(){

};

AppView.prototype = {
	render: function(){
		new GameView();
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
	this.state = [];

	for(var i=0; i<=19; i++){
		this.state.push([]);
	}

	PubSub.publish("/game/board", this.state);

	setInterval(this.tick.bind(this), 1000);
};

Game.prototype = {
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

		PubSub.publish("/game/board", this.state);
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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map