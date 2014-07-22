var app = app || {};

(function($) {
	"use strict";
	
	app.StepView = Backbone.View.extend({
	
		initialize: function () {
			this.listenTo(this.model.spaces, "add", this.addOne);
			this.listenTo(this.model, "play", this.play);
			this.$el.prop("id","step-" + this.model.get("time"));
			this.$el.prop("class","step");
		},
		
		render: function () {
			return this;
		},
		
		addOne: function (space) {
			var spaceView = new app.SpaceView({ model: space });
			this.$el.append(spaceView.render().el);
		},
		
		play: function () {
			this.$el.css("backgroundColor", "#FFFFFF");
			this.$el.animate({
				backgroundColor: "#EEEEEE"
			});
		}
		
	});
})(jQuery);