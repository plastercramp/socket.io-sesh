var app = app || {};

(function() {
	"use strict";
	
	app.Step = Backbone.Model.extend({
		
		initialize: function() {
			this.spaces = new app.Spaces();
		},
		
		play: function() {
			this.trigger("play");
			this.spaces.each(function(space) { space.play(); });
		}
		
	});
	
	app.Steps = Backbone.Collection.extend({
		model: app.Step,
		comparator: 'time'
	});

	app.steps = new app.Steps();
})();