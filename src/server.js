var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

app.use(express.static('build'));

var RoomList = {};
var curRoomName = '0';
io.on('connection', (socket) => {

    socket.on('SEND_ADDUSER', function(data){
        if(!data.isMobile){
            if(RoomList[data.RoomID] == undefined){
                RoomList[data.RoomID] = 1;
            }
            else{
                RoomList[data.RoomID]++;
            }
        }
        console.log(data)
        io.emit('RECEIVE_ROOMLIST', RoomList);
    })

    socket.on('GET_ROOMLIST', function () {
        io.emit('RECEIVE_ROOMLIST', RoomList);
    });

    socket.on('SEND_JOINROOM', function(data){
        io.emit('RECEIVE_CURROOMNAME', curRoomName);
    })

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    })

    socket.on('SEND_ORIENTATION', function(data){
        io.emit('RECEIVE_ORIENTATION', data);
    });

    socket.on('disconnect', () => {
        RoomList = {};
    });
});