const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('build'));

app.get('/', function (req, res) {
});

io.on('connection', (socket) => {
    console.log('Connection Success!');

    var url = socket.request.headers.referer;
    var splited = url.split('/');
    var roomID = splited[splited.length - 1];
    console.log('roomID: ' + roomID)

    socket.on('join', function() {
        socket.join(roomID);
        socket.to(roomID).emit('RECEIVE_SUCCESS_JOIN', roomID);
        console.log('加入了' + roomID);
    });

    socket.on('SEND_MESSAGE', function(data){
        socket.to(roomID).emit('RECEIVE_MESSAGE', data);
    })

    socket.on('SEND_ORIENTATION', function(data){
        socket.to(roomID).emit('RECEIVE_ORIENTATION', data);
    });

    socket.on('disconnect', () => {
        console.log('Disconnect');
    });
});
    
var port = process.env.PORT || 3001;
http.listen(port, "0.0.0.0", () => {
    console.log("Server Started. Port:" + port);
});

console.log('port: ' + port);