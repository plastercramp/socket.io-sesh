var app = app || {};

(function() {
	"use strict";
	
	app.Player = Backbone.Model.extend({
		
		initialize: function() {
			app.players.push(this);
		}
		
	});
	
	app.Players = Backbone.Collection.extend({
		model: app.Player
	});

	app.players = new app.Players();
	
})();