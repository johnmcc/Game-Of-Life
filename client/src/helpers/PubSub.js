var PubSub = {
	publish: function(channel, payload){
		// we need to check for the existence of the CustomEvent object,
    // otherwise our tests will fail
		if(typeof CustomEvent !== 'undefined' && typeof document !== undefined){
			var event = new CustomEvent(channel, {
				detail: payload
			});
			document.dispatchEvent(event);
		}
	},

	subscribe: function(channel, callback){
		// Same - we need to check for the existence of document
		if(typeof document !== 'undefined'){
			document.addEventListener(channel, callback);
		}
	}
}

module.exports = PubSub;
