
import React, { Component } from 'react';
import ChatBar from './ChatBar/ChatBar';
import ChatBoard from './ChatBoard/ChatBoard';
import CanvasComponent from './CanvasComponent/CanvasComponent';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';

import '../css/App.css';

const RoomID = new Date().getTime();
const host = window.location.hostname;
const port = window.location.port;
const socket = io.connect('https://' + host + ':' + port);

//判斷手機端
var sUserAgent = navigator.userAgent.toLowerCase();
var agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
var isMobile = false;
for (var v = 0; v < agents.length; v++) {
    if (sUserAgent.indexOf(agents[v]) >= 0) {
        isMobile = true;
    }
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            RoomList:[],
            RoomID: 0, 
            pageStatus:1
        };

        socket.on('RECEIVE_ROOMLIST', function(data){
            addRoomList(data);
        });

        const addRoomList = data => {
            this.setState({
                RoomList:data,
                pageStatus:2
            });
        };

        socket.on('RECEIVE_CURROOMNAME', function(data){
            showCurRoom(data);
        });

        const showCurRoom = data => {
            console.log('showCurRoom: ' + data)
        };
    }

    handlePlayClick = (e) => {
        socket.emit('SEND_ROOMLIST', {
            RoomID: RoomID
        });
    }

    handleJoinRoomClick = (e) => {
        socket.emit('SEND_JOINROOM', {
            RoomID: e.currentTarget.value
        });
        this.setState({
            pageStatus:3
        });
    }

    render() {
        const RoomList = this.state.RoomList;
        const element = Object.keys(RoomList).map((key, index) => 
            <Button key={index} color="secondary" onClick={this.handleJoinRoomClick} value={key}>
                Room： {key}, 人數： {RoomList[key]}
            </Button>
        );

        var renderIndexHtml = null;
        console.log(this.state.pageStatus)
        switch(this.state.pageStatus){
            case 1:
                renderIndexHtml = 
                    <div className = 'qrcode-container'>
                        <Button color="secondary" onClick={this.handlePlayClick}>
                        Play!
                        </Button>
                    </div>;
                break;

            case 2:
                renderIndexHtml =
                    <div className = 'qrcode-container'>
                        {element}
                    </div>;
                break;

            case 3:
                renderIndexHtml = 
                    <div>
                        <ChatBar />
                        <ChatBoard />
                        <CanvasComponent />
                    </div>
                break;
        }

        return (
            <div>
                {renderIndexHtml}
            </div>
        );
    }
}

export default App;