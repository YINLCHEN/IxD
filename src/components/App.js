import React, { Component } from 'react';
import ChatBar from './ChatBar/ChatBar';
import ChatBoard from './ChatBoard/ChatBoard';

import '../css/App.css';

class App extends Component {
    render() {
        return (
            <div>
                <ChatBar />
                <ChatBoard />
            </div>
        );
    }
}

export default App;
