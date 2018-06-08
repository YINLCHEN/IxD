import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';

import io from 'socket.io-client';

const SendIcon = (props) => (
    <SvgIcon {...props}>
        {
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        }
    </SvgIcon>
);

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    iconSmall: {
      fontSize: 20,
    },
});

class ChatBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        const host = window.location.hostname;
        const port = window.location.port;
        this.socket = io('https://' + host + ':' + port);

        //鍵盤移動事件
        window.addEventListener('keypress', (event) => {
            switch(event.key){
                case 'Enter':
                    this.handleSendClick()
                    this.ChatText.value = null
                    break;
                default:
                break;
            }
        }, true);
    }

    handleSendClick = (e) => {
        this.socket.emit('SEND_MESSAGE', {
            author: this.NicknameText.value,
            message: this.ChatText.value
        });
    }

    render(){
        return (
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="title" color="inherit" style={{width:'200px'}}>
                        Let's Chat!
                    </Typography>
                    <TextField
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="Nickname"
                        margin="normal"
                        inputRef={el => this.NicknameText = el} 
                    />
                    <TextField
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="今天想聊什麼呢？"
                        fullWidth
                        margin="normal"
                        inputRef={el => this.ChatText = el}
                    />
                    <Button variant="contained" color="secondary" onClick={this.handleSendClick}>
                        Send
                        <SendIcon style={{marginLeft:10}}/>
                    </Button>
                </Toolbar>
            </AppBar>
        )
    };
}

ChatBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatBar);