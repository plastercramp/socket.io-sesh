var config = require("./config")
 	, express = require("express")
	, mongoose = require("mongoose");

var app = new express()
	, http = require("http").Server(app);

app.use(express.static(config.publicDir));

mongoose.connect(config.mongoLocation);
var db = mongoose.connection;
db.once("open", initRoom);

function initRoom() {
	
	http.listen(config.port, config.ipaddress);
	
	var userSchema = mongoose.Schema({
		wave: String,
		room: String
	});
	
	var toneSchema = mongoose.Schema({
		_user: { type: String, ref: "User" },
		pitch: Number,
		time: Number
	});
	
	var roomSchema = mongoose.Schema({
		name: String,
		waves: [String]
	})
	
	var User = mongoose.model("User", userSchema);
	var Tone = mongoose.model("Tone", toneSchema);
	var Room = mongoose.model("Room", roomSchema);
	
	var io = require("socket.io")(http);
	
	
	io.sockets.on("connection", function(socket) {
		
		var user = null;
		
		//Requesting a room to join is the first socket event the server must receive.
		//Other events are bound once the user and room are initialized.
		socket.on("room", function(data) {
			
			user = new User({ wave: data.wave });
			user.save();
			socket.emit("local_id", { _id: user._id });
			
			//If no room is requested, we look for a room with at least one other user
			//where the wave type selected by this user is not present.
			if (data.room) {
				Room.findOne({ name: data.room }, (function(err, room) {
					if (err) return;
					if (room) {
						enterRoom(room);
					}
					else {
						var newRoom = new Room({ name: data.room, waves: [] });
						newRoom.save();
						enterRoom(newRoom);
					}
				}).bind(this));
			}
			else {
				Room.findOne().where("waves").nin([user.wave]).exec((function(err, room) {
					if (err) return;
					console.log(room);
					if (room) {
						enterRoom(room);
					}
					else {
						var newRoom = new Room({ name: Math.random().toString(36).substring(7), waves: [] });
						newRoom.save();
						enterRoom(newRoom);
					}
					
				}).bind(this));
			}
		});
		
		function enterRoom(room) {
			
			user.room = room.name;
			user.save();
			room.waves.push(user.wave);
			room.save();
			
			socket.emit("assign_room", { room: room.name });
			socket.join(room.name);
			
			console.log("connect:" + user._id);
			console.log("user:" + user._id + " -> room: " + user.room);

			io.sockets.in(room.name).emit("friend_connect", user.toJSON());
			User.find({ room: room.name }, function(err, friends) {
				if (err) return;
				friends.forEach(function(friend) {
					socket.emit("friend_connect", friend.toJSON());
					Tone.find({ _user: friend._id }, function(err, tones) {
						if (err || tones === null) return;
						tones.forEach(function(tone) {
							socket.emit("tone_add", tone.toJSON());
						});
					});
				});
			});
		
			socket.on("tone_add", function(data) {
				io.sockets.in(room.name).emit("tone_add", data);
				var tone = new Tone({ _user: user._id, pitch: data.pitch, time: data.time });
				tone.save();
			});
			
			socket.on("tone_remove", function(data) {
				io.sockets.in(room.name).emit("tone_remove", data);
				var test = { _user: mongoose.Types.ObjectId(data._user), pitch: data.pitch, time: data.time };
				console.log(test);
				Tone.findOneAndRemove({ _user: mongoose.Types.ObjectId(data._user), pitch: data.pitch, time: data.time }).exec();
			});
			
			socket.on("disconnect", function() {
				io.sockets.in(room.name).emit("friend_disconnect", { _id: user._id });
				room.waves.splice(room.waves.indexOf(user.wave), 1);
				room.save();
				if (room.waves.length == 0) {
					room.remove();
				}
				Tone.find({ _user: user._id }).remove().exec();
				User.findByIdAndRemove(user._id)
				console.log("disconnect: " + user._id);
			});
		
		}
	});
}