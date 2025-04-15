var Model = Backbone.Model.extend({
	defaults : {
		iframe : true,
		history : []
	},
	initialize : function(){
		if(this.get('iframe')){
			this.iframe = document.createElement('iframe');
			this.iframe.style.display = 'none';
			document.body.appendChild(this.iframe);
			this.sandbox = this.iframe.contentWindow;
			this.sandboxEval = this.sandbox.eval;
		}
	},
	getHistory : function(){
		var history = this.get('history');
		return history;
	},
	pushHistory : function(obj){
		var history = this.getHistory();
		history.push(obj);
		return this.set('history', history);
	},
	popHistory:function(){
		var history = this.getHistory();
		history.pop();
		return this.set('history', history);		
	},
	shiftHistory:function(){
		var history = this.getHistory();
		history.shift();
		return this.set('history', history);		
	},
	unshiftHistory:function(){
		var history = this.getHistory();
		history.unshift();
		return this.set('history', history);		
	},
	reverseHistory:function(){
		var history = this.getHistory();
		var reverse = history.reverse();
		return this.set('history', reverse);		
	}
});

var View = Backbone.View.extend({
	template : _.template($('#input').html()),
	initialize:function(){
		this.listenTo(this.model,'change', this.render);
		this.listenTo(this.model,'destroy', this.remove);
	},
	render : function(){
		return this;
	}
});

var Router = Backbone.Router.extend({
	preinitialize : function(){
		this.model = new Model({iframe:true});
		this.view = new View({model:this.model});
	},
	initialize : function(){
		Backbone.history.start();
	}
});

window.sandbox = new Router();

window.sandbox.model.pushHistory(0);
window.sandbox.model.pushHistory(2);
window.sandbox.model.pushHistory(3);

console.log(sandbox.model.toJSON());

sandbox.model.reverseHistory();

console.log(sandbox.model.toJSON());
