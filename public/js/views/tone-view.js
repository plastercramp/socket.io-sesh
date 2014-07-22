var app = app || {};

(function($) {
	"use strict";
	
	app.ToneView = Backbone.View.extend({
	
		initialize: function () {
			this.listenTo(this.model, "play", this.play);
			this.listenTo(this.model, "remove", this.remove);
		},
		
		render: function () {
			this.$el.addClass("tone tone-" + this.model.player.get("wave"));
			this.$el.fadeIn();
			return this;
		},
		
		play: function() {
			var oscillator = app.audioContext.createOscillator();
			oscillator.type = this.model.player.get("wave");
			oscillator.connect(app.audioContext.destination);
			oscillator.frequency.value = app.FREQS[this.model.get("pitch")];
			oscillator.start(0);
			setTimeout((function() {
				this.oscillator.stop(0);
				this.oscillator.disconnect();
			}).bind({ oscillator: oscillator }), app.NOTELENGTH);
			this.$el.fadeIn();
			this.$el.css("opacity", 1);
			setTimeout((function() {
				this.$el.css("opacity", 0.4);
			}).bind(this), app.NOTELENGTH);
		}
		
	});
})(jQuery);