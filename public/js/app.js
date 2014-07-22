var app = app || {};
app.DURATION = 32;
app.RANGE = 16;
app.WAVES = ["sine", "sawtooth", "triangle"];
app.FREQS = 	[ 1760,
  				1567.982,
  				1396.912,
  				1174.66,
  				1046.502,
  				880,
  				783.991,
  				698.456,
  				587.33,
  				523.251,
  				440,
  				391.995,
  				349.228,
  				293.665,
  				261.626,
  				220,
  				195.998,
  				174.614,
  				146.833,
  				130.813 ];
app.NOTELENGTH = 100;
app.LOCATION = "http://localhost/"; //the location of the node.js server

$(function() {
	
	$(".select-wrapper").hover(function() {
		$(this).css("background-color","#EEEEEE");
	}, 	function() {
		$(this).css("background-color","#FFFFFF");
	});
	$(".select-wrapper").mousedown(function() {
		$(this).css("background-color","#E0E0E0");
	})
	
	for (var i = 0; i < 3; i++ ) {
		$("#select-" + app.WAVES[i]).mouseup((function() {
			app.wave = this.wave;
			start() }).bind({ wave: app.WAVES[i] }))
			.fadeIn((i + 1) * 1000);
	}
	
});

function start() {
	$("#splash").remove();
	
	app.audioContext = null;
	
	if (typeof AudioContext !== "undefined") {
	 	app.audioContext = new AudioContext();
	} else if (typeof webkitAudioContext !== "undefined") {
	 	app.audioContext = new webkitAudioContext();
	}
	
	app.room = window.location.hash.substring(1);
	
	app.socket = io.connect(app.LOCATION);
	app.socket.emit("room", { room: app.room, wave: app.wave });

	app.socket.on("assign_room", function(data) {
		app.room = data.room;
		window.location.hash = '#' + app.room;
	});
	
	app.socket.on("local_id", function(data) {
		app.localPlayer.set("_id", data._id);
	});
	
	app.socket.on("friend_connect", function(data) {
		new app.Player(data);
		console.log(data);
	});
	
	app.socket.on("friend_disconnect", function(data) {
		app.players.remove(app.players.findWhere({ _id: data._id }));
		app.steps.each(function(step) {
			step.spaces.each(function(space) {
				space.tones.remove(space.tones.findWhere({ _user: data._id }));
			})
		})
	});
	
	app.socket.on("tone_add", function(data) {
		console.log("new tone");
		console.log(data);
		if (data._user != app.localPlayer.get("_id")) {
			app.steps.at(data.time).spaces.at(data.pitch).toneAdd(data._user);
		}
	});
	
	app.socket.on("tone_remove", function(data) {
		console.log("remove tone");
		console.log(data);
		if (data._user != app.localPlayer.get("_id")) {
			app.steps.at(data.time).spaces.at(data.pitch).toneRemove(data._user);
		}
	});
	
	app.appView = new app.AppView();
	app.localPlayer = new app.Player({ wave: app.wave, room: app.room });
	
	for (var i = 0; i < app.DURATION; i++) {
		var step = new app.Step({ time: i });
		app.steps.push(step);
		for (var j = 0; j < app.RANGE; j++) {
			var space = new app.Space({ time: i, pitch: j });
			step.spaces.push(space);
		}
	}
	
	app.appView.render();
	
	app.curStep = 0;
	setInterval(function(){
		app.curStep = (app.curStep + 1) % app.DURATION;
		app.steps.at(app.curStep).play();
	}, app.NOTELENGTH);
}