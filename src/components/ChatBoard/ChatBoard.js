import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    }
});

class ChatBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages : []
        };
        var host = window.location.hostname;
        var port = window.location.port;
        this.socket = io('https://' + host + ':' + port);

        this.socket.on('RECEIVE_MESSAGE', function(messages){
            addMessage(messages);
        });
        const addMessage = messages => {
            this.setState({messages: [...this.state.messages, messages]});
        };
    }

    render(){
        return (
            <div>
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