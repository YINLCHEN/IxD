import React, { Component } from 'react';
import ChatBar from './ChatBar/ChatBar';
import ChatBoard from './ChatBoard/ChatBoard';
import CanvasComponent from './CanvasComponent/CanvasComponent';
import Button from '@material-ui/core/Button';
import QRCode from 'qrcode.react';
import io from 'socket.io-client';

import '../css/App.css';

const location = window.location.toString();
const host = window.location.hostname;
const port = window.location.port;
const socket = io.connect('https://' + host + ':' + port);

socket.on('connect', function () {
    socket.emit('join');
});

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            loggin: 1,
        }
        console.log('location: ' + location)
    }

    componentDidMount(){
        socket.on('RECEIVE_SUCCESS_JOIN', function(messages){
            changeRenderHtml(messages);
        });

        const changeRenderHtml = messages => {
            this.setState({
                loggin: 3
            });
        };
    }

    handlePlayClick = (e) => {
        this.setState({
            loggin: 2
        });
    }

    render() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
        var isMobile = false;
        for (var v = 0; v < agents.length; v++) {
            if (sUserAgent.indexOf(agents[v]) >= 0) {
                isMobile = true;
            }
        }

        let renderQRcode;

        if (!isMobile) {
            switch(this.state.loggin){
                case 1:
                    renderQRcode =
                    <div>
                        <div className = 'qrcode-container'>
                            <Button color="secondary" onClick={this.handlePlayClick}>
                                Play!
                            </Button>
                        </div>
                    </div>;
                break;
                case 2:
                    renderQRcode =
                    <div>
                        <div className = 'qrcode-container'>
                            <QRCode value={location} />
                        </div>
                    </div>;
                break;
                case 3:
                    renderQRcode = 
                        <div>
                            <ChatBar />
                            <ChatBoard />
                            <CanvasComponent />
                        </div>;
                break;
                default:
            }
        }
        else{
            renderQRcode = 
                <div>
                    <ChatBar />
                    <ChatBoard />
                    <CanvasComponent />
                </div>;
        }

        return (
            <div>
                {renderQRcode}
            </div>
        );
    }
}

export default App;
