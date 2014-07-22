var app = app || {};

(function () {
	"use strict";

	app.Steps = Backbone.Collection.extend({
		model: app.Step,
		comparator: 'time'
	});

	app.steps = new app.Steps();
})();
