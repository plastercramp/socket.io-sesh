var app = app || {};

(function() {
	"use strict";
	
	app.Space = Backbone.Model.extend({
		
		initialize: function() {
			this.tones = new app.Tones();
		},
		
		play: function() {
			this.tones.each(function(tone) { tone.play(); });
		},
		
		toggleTone: function(_user) {
			var exists = this.tones.findWhere({ _user: _user });
			if (typeof exists === "undefined") {
				this.toneAdd(_user);
			}
			else {
				this.toneRemove(_user);
			}
		},
		
		toneAdd: function(_user) {
			this.tones.add(new app.Tone({ _user: _user, pitch: this.get("pitch"), time: this.get("time") }));
		},
		
		toneRemove: function(_user) {
			var exists = this.tones.findWhere({ _user: _user });
			if (_user === app.localPlayer.get("_id")) {
				exists.signalRemove();
			}
			this.tones.remove(exists);
		}
		
	});
	
	app.Spaces = Backbone.Collection.extend({
		model: app.Space,
		comparator: 'pitch'
	});
	
})();