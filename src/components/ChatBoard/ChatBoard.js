import React, { Component } from 'react';
import io from 'socket.io-client';

const host = window.location.hostname;
const port = window.location.port;
const socket = io('https://' + host + ':' + port);
socket.on('connect', function () {
    socket.emit('join');
});

const styles = {
    Sidebar:{
        width:'200px',
        float:'left',
        height:'280px',
        fontSize:'10px',
        fontWeight:'bold'
    },
};

class ChatBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages : []
        };

        socket.on('RECEIVE_MESSAGE', function(messages){
            addMessage(messages);
        });

        const addMessage = messages => {
            this.setState({messages: [...this.state.messages, messages]});
        };
    }

    render(){
        return (
            <div style={styles.Sidebar}>
                {this.state.messages.map((message,index) => {
                    return (
                        <div key={index}>{message.author}: {message.message}</div>
                    )
                })}
            </div>
        )
    };
}

export default ChatBoard;