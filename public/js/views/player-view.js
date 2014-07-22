var app = app || {};

(function($) {
	"use strict";
	
	app.PlayerView = Backbone.View.extend({
		
		template: _.template($('#player-template').html()),
		
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.addClass("playerevent");
			return this;
		}
		
	});
})(jQuery);