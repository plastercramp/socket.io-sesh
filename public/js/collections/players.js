var app = app || {};

(function () {
	"use strict";

	app.Players = Backbone.Collection.extend({
		model: app.Player
	});

	app.players = new app.Players();
})();
