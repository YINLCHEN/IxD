const express = require('express');
const path = require('path');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('build'));

app.get('/', function (req, res) {
    res.sendFile(path.join('index.html'));
});

io.on('connection', (socket) => {
    console.log('Hello!');

    socket.on('SEND_MESSAGE', function(data){
        console.log('MESSAGE: ' + data);
        io.emit('RECEIVE_MESSAGE', data);
    })

    socket.on('SEND_ORIENTATION', function(data){
        io.emit('RECEIVE_ORIENTATION', data);
    });

    socket.on('disconnect', () => {
        console.log('Bye~');
    });
});

var port = process.env.PORT || 3001;
http.listen(port, "0.0.0.0");
console.log('port: ' + port);