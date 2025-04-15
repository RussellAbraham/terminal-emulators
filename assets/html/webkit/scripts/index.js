
require.config({
    baseUrl: 'scripts',
    paths: {
	    jquery: 'lib/jquery.min',
	    lodash: 'lib/lodash.min',
	    backbone: 'lib/backbone.min',        
			text: 'lib/text.min',      
			link: 'lib/link',              
			UIStack: 'lib/UIStack-min',
  	}
 });
 
require( [ 'backbone', 'controller' ], function(Backbone){
			
			//initialize the Router/Controller
		 	window.controller = new Controller();
		 	Backbone.history.start();

});
