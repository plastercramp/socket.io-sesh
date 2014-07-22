var app = app || {};

(function($) {
	"use strict";
	
	app.SpaceView = Backbone.View.extend({
		
		events: {
			"mouseenter" : "mouseenterEvent",
			"mouseup" : "toggleTone"
		},
		
		initialize: function () {
			this.listenTo(this.model.tones, "add", this.addOne);
			this.$el.prop("id","space-" + this.model.get("time") + "-" + this.model.get("pitch"));
			this.$el.prop("class","space");
			this.$el.mouseover(function() {
				$(this).css("background-color","#rgba(0,0,0,0.1)");
			}).mouseout(function() {
				$(this).css("background-color","#rgba(0,0,0,0)");
			}).mousedown(function() {
				$(this).css("background-color","#rgba(0,0,0,0.2)");
			})
		},
		render: function () {
			return this;
		},
		
		mouseenterEvent: function() {
			if (app.appView.mousedown) {
				this.model.toggleTone(app.localPlayer.get("_id"));
			}
		},
		
		toggleTone: function() {
			this.model.toggleTone(app.localPlayer.get("_id"));
		},
		
		addOne: function (tone) {
			var toneView = new app.ToneView({ model: tone });
			this.$el.append(toneView.render().el);
			toneView.$el.css("z-index", 0);
		}
		
	});
})(jQuery);