import React, { Component } from 'react';
import io from 'socket.io-client';

const host = window.location.hostname;
const port = window.location.port;
var socket = io.connect('https://' + host + ':' + port);

const styles = {
    Body:{
        fontSize:'15px',
        fontWeight:'bold',
        float:'left',
        backgroundColor: 'black'
    }
};

//判斷手機端
var sUserAgent = navigator.userAgent.toLowerCase();
var agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
var isMobile = false;
for (var v = 0; v < agents.length; v++) {
    if (sUserAgent.indexOf(agents[v]) >= 0) {
        isMobile = true;
    }
}

class CanvasComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages : [],
            alpha:0,
            beta:0,
            gamma:0
        };
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

            socket.emit('SEND_ORIENTATION', {
                alpha: Math.round(alpha),
                beta:  Math.round(beta),
                gamma: Math.round(gamma)
            });
        }, false);

        if(isMobile === false){
            socket.on('RECEIVE_ORIENTATION', function(data){
                addOrientation(data);
            });
    
            const addOrientation = data => {
                if(data.beta < 0 && data.beta >=-180){
                    //console.log('up');
                    dy = -1;
                }
                else if(data.beta >= 0 && data.beta < 180){
                    //console.log('down');
                    dy = 1;
                }
    
                if(data.gamma < 0 && data.gamma >= -90){
                    //console.log('left');
                    dx = -1;
                }
                else if(data.gamma >= 0 && data.gamma < 90){
                    //console.log('right');
                    dx = 1;
                }
            };
    
            //Canvas繪圖
            var canvas = this.refs.canvas;
            var ctx = this.refs.canvas.getContext("2d");
            var x = this.refs.canvas.width / 2;
            var y = this.refs.canvas.height / 2;
            var ballRadius = 10;
            var dx = 0;
            var dy = 0;
    
            var isEat = 10;
            var isGG = false;
            var luckyBallX = 500;
            var luckyBallY = 600;
    
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
    
                if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
                    dx = -dx;
                    isGG = true;
                }
                if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
                    dy = -dy;
                    isGG = true;
                }
    
                if(!isGG){
                    if((luckyBallX+ballRadius >= x && luckyBallX-ballRadius <= x)&&(luckyBallY+ballRadius >= y && luckyBallY-ballRadius <= y)){
                        drawBall(isEat+=5);
                        ballRadius+=5;
                        luckyBallX = Math.floor(( Math.random() * (canvas.width-200) ) + 200);
                        luckyBallY = Math.floor(( Math.random() * (canvas.height-200) ) + 200);
                    }
                    else{
                        drawBall(isEat);
                    }
    
                    drawLuckyBall(luckyBallX, luckyBallY);
                }
                else{
                    window.clearInterval(intervalDrawID);
                    sendScore(ballRadius);
                    alert('GG!');
                }
        
                x += dx;
                y += dy;
            }
    
            const sendScore = (data) => {
                var msg = '';
                if(data<50){
                    msg = data-10 + '分, 也太爛了吧 ＝＝';
                }
                else{
                    msg = data-10 + '分, 啊不就好棒棒？！';
                }
    
                socket.emit('SEND_MESSAGE', {
                    author: '分數',
                    message: msg
                });
            };
    
            function drawBall(isEat) {
                ctx.beginPath();
                ctx.arc(x, y, isEat, 0, Math.PI*2);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
    
            function drawLuckyBall(luckyBallX, luckyBallY) {
                ctx.beginPath();
                ctx.arc(luckyBallX, luckyBallY, 10, 0, Math.PI*2);
                ctx.fillStyle = "yellow";
                ctx.fill();
                ctx.closePath();
            }
            
            //鍵盤移動事件
            window.addEventListener('keydown', (event) => {
                switch(event.key){
                    case 'ArrowUp':
                        dx = 0;
                        dy = -5;
                        break;
                    case 'ArrowDown':
                        dx = 0;
                        dy = 5;
                        break;
                    case 'ArrowLeft':
                        dx = -5;
                        dy = 0;
                        break;
                    case 'ArrowRight':
                        dx = 5;
                        dy = 0;
                        break;
                    default:
                    break;
                }
            }, true);

            var intervalDrawID =  setInterval(draw, 10);
        }
    }

    render(){
        let element;
        if(isMobile === false) 
        {
            element = 
            <div style={styles.Body}>
                <canvas ref='canvas' width="1400" height="800">不支援Canvas</canvas>
            </div>;
        }

        return (
            <div>
                {element}
            </div>
        )
    };
}

export default CanvasComponent;