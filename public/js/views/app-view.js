var app = app || {};

(function($) {
	"use strict";
	
	app.AppView = Backbone.View.extend({
		
		el: "#stage",
		
		events: {
			"mousedown": "mousedownEvent",
			"mouseup": "mouseupEvent",
		},
	
		initialize: function () {
			this.listenTo(app.steps, "add", this.addStep);
			this.listenTo(app.players, "add", function (player) { this.playerEvent(player, true) });
			this.listenTo(app.players, "remove", function (player) { this.playerEvent(player, false) });
			
			this.adjustHeight();
			$(window).resize(this.adjustHeight);
			
			var tipView = $("<div class='tip'>SHARE THIS URL TO INVITE FRIENDS TO THIS SESH</div>");
			setTimeout((function() {
				tipView.slideUp();
			}).bind({ tipView: tipView }), 5000);
			this.$el.append(tipView);
			
			
			this.playerEventRendered = false;
			this.mousedown = false;
		},
		
		adjustHeight: function () {
			$("#stage").css("margin-top", ($(window).height() - $(window).width() / 2) / 2);
		},
		
		addStep: function (step) {
			var stepView = new app.StepView({ model: step });
			this.$el.append(stepView.render().el);
		},
		
		playerEvent: function(player, join) {
			if (this.playerEventRendered) {
				setTimeout((function () { this.playerEvent(player, join); }).bind(this), 4000);
			}
			else {
				this.renderPlayerEvent(player, join);
			}
		},
		
		renderPlayerEvent: function(player, join) {
			
			this.playerEventRendered = true;
			
			var playerView = new app.PlayerView({ model: player });
			this.$el.append(playerView.render().el);
			playerView.$el.find(".note").text(join ? "HELLO FRIENDS I AM HERE" : "GOODBYE FRIENDS I AM GONE");
			playerView.$el.slideToggle();
			
			setTimeout((function() {
				playerView.$el.slideToggle();
				playerView.$el.remove();
				app.appView.playerEventRendered = false;
			}).bind( {playerView: playerView }), 4000);
		},
		
		mousedownEvent: function () {
			this.mousedown = true;
		},
		
		mouseupEvent: function () {
			this.mousedown = false;
		}
		
	});
})(jQuery);