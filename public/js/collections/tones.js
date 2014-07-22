var app = app || {};

(function () {
	"use strict";

	app.Tones = Backbone.Collection.extend({
		model: app.Tone,
		comparator: 'pitch'
	});

})();
