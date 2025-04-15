var app = {

	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	receivedEvent: function(id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');

		console.log('Received Event: ' + id);
		app.testPluginCalls();
	},
	testPluginCalls: function() {
		//if (community && community.mongoose) {
		//	// app.writeOut('Results of starting Mongoose server:\n ' + community.mongoose.start({}));
		//	// app.writeOut('Results of starting Mongoose server:\n ' + community.mongoose.start({ "listening_ports" : "8080" }));
		//	app.writeOut('Results of starting Mongoose server:\n ' + community.mongoose.start({ "listening_ports" : 8080 }));
		//	app.writeOut('Results of stopping Mongoose server:\n ' + community.mongoose.stop());
		//} else {
		//	app.writeOut("Plugin was not found");
		//}
	},
	
	writeOut: function(message) {
		var output = document.getElementById('results');
		output.innerText = output.innerText + message;
		output.appendChild(document.createElement('br'));
		console.log(message);
	}
	
};