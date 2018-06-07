import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    Sidebar: {
        width:'120px',
        float:'left',
        height:'280px',
        textAlign:'center',
        lineHeight:'280px',
        fontSize:'15px',
        fontWeight:'bold'
    },
});

const styles1 = {
    Sidebar: {
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
        var host = window.location.hostname;
        var port = window.location.port;
        this.socket = io('http://' + host + ':' + port);

        this.socket.on('RECEIVE_MESSAGE', function(messages){
            addMessage(messages);
        });
        const addMessage = messages => {
            this.setState({messages: [...this.state.messages, messages]});
        };
    }

    render(){
        return (
            <div style={styles1.Sidebar}>
                {this.state.messages.map((message,index) => {
                    return (
                        <div key={index}>{message.author}: {message.message}</div>
                    )
                })}
            </div>
        )
    };
}

ChatBoard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatBoard);