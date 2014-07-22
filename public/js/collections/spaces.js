var app = app || {};

(function () {
	"use strict";

	app.Spaces = Backbone.Collection.extend({
		model: app.Space,
		comparator: 'pitch'
	});

})();
