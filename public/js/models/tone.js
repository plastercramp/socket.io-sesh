var app = app || {};

(function() {
	"use strict";
	
	app.Tone = Backbone.Model.extend({
		
		initialize: function() {
			console.log("init tone");
			this.player = app.players.findWhere({ _id: this.get("_user")});
			if (this.get("_user") === app.localPlayer.get("_id")) {
				this.signalAdd();
			}
		},
		
		play: function() {
			this.trigger("play");
		},
		
		signalAdd: function() {
			app.socket.emit("tone_add", this);
		},
		
		signalRemove: function() {
			console.log("remove tone local");			
			app.socket.emit("tone_remove", this);
		}
		
	});
	
	app.Tones = Backbone.Collection.extend({
		model: app.Tone,
		comparator: 'pitch'
	});
})();