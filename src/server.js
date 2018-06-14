const express = require('express');
const path = require('path');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('build'));

var RoomList = {};
var curRoomName = '';
io.on('connection', (socket) => {

    socket.on('SEND_ROOMLIST', function(data){
        if(RoomList[data.RoomID] == undefined){
            RoomList[data.RoomID] = 1;
        }
        else{
            RoomList[data.RoomID]++;
        }
        io.emit('RECEIVE_ROOMLIST', RoomList);
    })

    socket.on('SEND_JOINROOM', function(data){
        curRoomName = data.RoomID;
        io.emit('RECEIVE_CURROOMNAME', curRoomName);
    })

    socket.on('SEND_MESSAGE', function(data){
        socket.join(curRoomName);
        io.to(curRoomName).emit('RECEIVE_MESSAGE', data);
    })

    socket.on('SEND_ORIENTATION', function(data){
        socket.join(curRoomName);
        io.to(curRoomName).emit('RECEIVE_ORIENTATION', data);
    });

    socket.on('disconnect', () => {
        delete RoomList[curRoomName];
    });
});

var port = process.env.PORT || 3001;
http.listen(port, "0.0.0.0");
console.log('port: ' + port);