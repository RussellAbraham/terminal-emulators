define([
	   'config',
	   'UIStack',
       'pages/takePhotoView/main',
       'pages/effectsView/main',
       'pages/moustachesView/main',
       'pages/aboutView/main',
	], function(){
		
	Controller = Backbone.Router.extend({
	    
        app: $("#App"),
        
        routes: {
            
        	"effects" : "effects",
        	"moustaches" : "moustaches",
        	"about" : "about"
        },
        
        initialize: function(){            
            //create a new instance of BB10-UI-Stack
        	this.tabView = new UIStack({ router: this, app: this.app, config: config});  

            //append main view to app
            this.takePhotoView = new takePhotoView();
            this.tabView.$el.find('#views > section').prepend(this.takePhotoView.render().el);
            //cache other views
            this.effectsView = new effectsView();
            this.moustachesView = new moustachesView();
            this.aboutView = new aboutView();
            window.location = "#moustaches";
        },
		
		effects: function(){	    
            this.tabView.showTab(this.effectsView);   
		},
		
        moustaches: function(){            
            this.tabView.showTab(this.moustachesView);    
        },
        
        about: function(){            
            this.tabView.showTab(this.aboutView);
        }
        
	});
});