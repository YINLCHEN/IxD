import React, { Component } from 'react';
import io from 'socket.io-client';

const styles = {
    Body:{
        fontSize:'15px',
        fontWeight:'bold',
        float:'left',
        backgroundColor: 'black'
    }
};

class CanvasComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages : [],
            alpha:0,
            beta:0,
            gamma:0
        };
        const host = window.location.hostname;
        const port = window.location.port;
        this.socket = io('https://' + host + ':' + port);
    }

    componentDidMount(){
        //裝置陀螺儀
        var alpha;
        var beta;
        var gamma;

        window.addEventListener('deviceorientation', (event) => {
            alpha = event.alpha;
            beta  = event.beta;
            gamma = event.gamma;

            this.socket.emit('SEND_ORIENTATION', {
                alpha: Math.round(alpha),
                beta:  Math.round(beta),
                gamma: Math.round(gamma)
            });
        }, false);

        this.socket.on('RECEIVE_ORIENTATION', function(data){
            addOrientation(data);
        });
        const addOrientation = data => {
            
            if(data.beta < 0 && data.beta >=-180){
                //console.log('up');
                dy=-5;
            }
            else if(data.beta >= 0 && data.beta < 180){
                //console.log('down');
                dy=5;
            }

            if(data.gamma < 0 && data.gamma >= -90){
                //console.log('left');
                dx=-5;
            }
            else if(data.gamma >= 0 && data.gamma < 90){
                //console.log('right');
                dx=5;
            }
        };

        //Canvas繪圖
        var canvas = this.refs.canvas;
        var ctx = this.refs.canvas.getContext("2d");
        var x = this.refs.canvas.width/2;
        var y = this.refs.canvas.height-30;
        var ballRadius = 10;
        var dx = 0;
        var dy = 0;

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();

            if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
                dy = -dy;
            }
    
            x += dx;
            y += dy;
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI*2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
        
        //鍵盤移動事件
        window.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'ArrowUp':
                    dx=0;
                    dy=-10;
                    break;
                case 'ArrowDown':
                    dx=0;
                    dy=10;
                    break;
                case 'ArrowLeft':
                    dx=-10;
                    dy=0;
                    break;
                case 'ArrowRight':
                    dx=10;
                    dy=0;
                    break;
                default:
                    break;
            }
            console.log('(dx, dy) => ' + dx + ', ' + dy)
            drawBall();
        }, true);

        setInterval(draw, 10);
    }

    render(){
        return (
            <div style={styles.Body}>
                <canvas ref='canvas' width="1400" height="600">不支援Canvas</canvas>
            </div>
        )
    };
}

export default CanvasComponent;