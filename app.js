var express = require('express');

// Port listening
var appListenOnPortConfig = process.env.PORT || 8080;

// config of express
var app = express();

// Binding the listening socket
var server = app.listen(appListenOnPortConfig, function () {
  console.log('Express server listening on port ' + appListenOnPortConfig);
});

// Socket.IO will listen on the same port as our Web server
var sio = require('socket.io').listen(server);


// Static pages (such as angularjs, css and client-side js) are statically served
app.use('/', express.static(__dirname + '/angulartest'));

var currentAnswers = [{
	"option" : "yes",
	"value" : 0
	},
	{
	"option" : "no",
	"value" : 0
	},
	{
	"option" : "maybe",
	"value" : 0
	}
];
// User connection handle by the socket
sio.on('connection', function(socket){
  console.log('a user connected');

  // Vote from a client 
  socket.on("answer", function(index){
		currentAnswers[index].value++;
		// Send the update to every client
		sio.sockets.emit("currentVote",currentAnswers);
		console.log("Vote was send : " + index);
  });
  
  // ASK result from one client
  socket.on("getResult", function(){
	  socket.emit("currentVote", currentAnswers);
  });
 
  
  // Rest the poll
  socket.on("reset", function(){
	  currentAnswers[0].value = 0;
	  currentAnswers[1].value = 0;
	  currentAnswers[2].value = 0;
	  sio.sockets.emit("currentVote", currentAnswers);
	  console.log("reset call");
  })
});