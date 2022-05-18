/*********
 * Snake Box v 1.0
 * A very simple snake clone
 * 
 * Copyright: OnThisPhone 2022
 * Made from scratch in the span of a few hours.
 * Use as you want. Just credit me.
 * 
 * Supports touch controls for mobile and keyboard controls for desktop
 * 
 * NOTES:
 * Some bug where the game won't reset all the time. It was difficult to replicate, so i guess it's a feature now! :D
 * Controls could be a bit better.
 * Code could probably look a bit better.
 * Device detecting functionality written by https://attacomsian.com/blog/javascript-detect-mobile-device
 */
var x, y;//Real position of snake head
var snakeColor;//Color of snake
var snakeDir;//Direction of snake
var confirmMove;//Fixes a bug with moving. Kind of ugly, but what'dja gonna do.
var snakeEater;//Array with macros. This method could probably be done better.
var snakeLength;//Length of snake
var score;//Score.
var playing;//If the game has started, this is set to true

var pelletColor;//Color of the pellet that the snake has to eat
var pelletX, pelletY;

var res = 20;//Resolution of the game. It divides the real canvas H and W.
var canvasSize = 400;
var squareSize = canvasSize/res;

//Some DOM and JS objects.
var canvas;
var context;
var statusCode;

//Timing stuff
const frameUpdateInterval = 150;
/*var oldTime = 0;
const timeTarget = 70;*/

//Some static constants
//  A bit over-engineered for this type of game, but it works.
const DIR_NONE = -1;
const DIR_UP = 0;
const DIR_RIGHT = 1;
const DIR_DOWN = 2;
const DIR_LEFT = 3;

function init(){

    //Set some UI stuff
    statusCode = document.body.querySelector(".statusCode");

    //Set the game arena
    canvas = document.body.querySelector("#game");
    /*canvas.style.height = canvasSize + "px";
    canvas.style.width = canvasSize + "px";*/
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    //Initialize context and clear the canvas.
    context = canvas.getContext("2d");
    context.clearRect(0,0, canvasSize, canvasSize);

    //Set some default snake stuff
    x = squareSize * (res/2);
    y = squareSize * (res/2);
    snakeDir = DIR_NONE;
    snakeColor = "#ffffff";
    confirmMove = true;

    snakeLength = 0;//Which is 1. Just the pixel moving around.
    snakeEater = new Array();

    pelletX = -squareSize;//Hides it. Lol.
    pelletY = -squareSize;
    pelletColor = "#55aabb";

    //Initialize controls.
    window.addEventListener("keydown", (e) =>{
        controls(e);
    });

    //Misc default values
    score = 0;

    if(deviceType() === "desktop")
        updateStatusCode("Press any direction to start");
    else
        updateStatusCode("Swipe any direction to start");
    console.log("Game has been initialized");
}

//Resets the game
function resetGame(){
    context.clearRect(0,0, canvasSize, canvasSize);
    score = 0;
    x = squareSize * (res/2);
    y = squareSize * (res/2);
    snakeDir = DIR_NONE;
    confirmMove = true;
    snakeLength = 0;
    snakeEater = new Array();
    pelletX = -squareSize;//Hides it. Lol.
    pelletY = -squareSize;
    if(deviceType() === "desktop")
        updateStatusCode("Press any direction to start");
    else
        updateStatusCode("Swipe any direction to start");
    console.log("Game has been reset");
}

function update(){

    //Initial drawing
    draw();
    generatePellet();
    var loop = window.setInterval(function(){
        //Don't bother with proper timers. This works just fine for this type of game.
        //Update status code
        if(playing)
            updateStatusCode("Score: " + score);
        
        //Do move
        move();
        
        //Collide
        if(collide() == true){
            playing = false;
            clearInterval(loop);
        }

        //Draw
        draw();

    }, frameUpdateInterval);
}
function draw(){
    //context.clearRect(0,0, canvasSize, canvasSize);

    //Draw pellet
    context.fillStyle = pelletColor;
    context.fillRect(pelletX, pelletY, squareSize, squareSize);

    //Draw snek
    context.fillStyle = snakeColor;
    context.fillRect(x,y, squareSize, squareSize);

    
}

//Could be improved by buffering inputs.
function controls(event){
    var k = event.key;
    if(k === "ArrowUp" && snakeDir !== DIR_DOWN && confirmMove){
        snakeDir = DIR_UP;
        confirmMove = false;
    }else if(k === "ArrowRight" && snakeDir !== DIR_LEFT && confirmMove){
        snakeDir = DIR_RIGHT;
        confirmMove = false;
    }else if(k === "ArrowDown" && snakeDir !== DIR_UP && confirmMove){
        snakeDir = DIR_DOWN;
        confirmMove = false;
    }else if(k === "ArrowLeft" && snakeDir !== DIR_RIGHT && confirmMove){
        snakeDir = DIR_LEFT;
        confirmMove = false;
    }else if(k === "Enter" && !playing){//Restarts the game.
        console.log("Restarting game");
        resetGame();
        update();
    }

    if(!playing && (k === "ArrowUp" || k === "ArrowRight" || k === "ArrowDown" || k === "ArrowLeft"))
        playing = true;
}
function move(){
    if(playing){
        updateSnakeEater(snakeDir);
        //console.log(snakeEater[0]);
    }
    switch(snakeDir){
        case DIR_UP:
            y -= squareSize;
            confirmMove = true;
            break;
        case DIR_RIGHT:
            x += squareSize;
            confirmMove = true;
            break;
        case DIR_DOWN:
            y += squareSize;
            confirmMove = true;
            break;
        case DIR_LEFT:
            x -= squareSize;
            confirmMove = true;
            break;
    }
}

//Checks if you reach the end of the stage, hit a pellet or hit yourself.
//Returns true if a bad collision happens.
function collide(){
    //Outside of map. Game over
    if(x < 0){
        updateStatusCode("Game Over.. Score: " + score);
        return true;
    } else if(y < 0){
        updateStatusCode("Game Over.. Score: " + score);
        return true;
    } else if(y >= canvasSize){
        updateStatusCode("Game Over.. Score: " + score);
        return true;
    } else if(x >= canvasSize){
        updateStatusCode("Game Over.. Score: " + score);
        return true;
    }

    //Hit the snake. Game over
    if(getColor(x,y) == 255 && playing){
        updateStatusCode("Game Over.. Score: " + score);
        return true;
    }

    //Hit a pellet! Yay!
    if(x == pelletX && y == pelletY){
        score += 1;
        snakeLength += 1;
        generatePellet();
    }

}

//If message is left empty, it'll remove the DOM element entirely
function updateStatusCode(message){
    statusCode.innerHTML = message;

    if(message === "")
        statusCode.style.display = "none";
    else
        statusCode.style.display = "block";
}

function generatePellet(){
    //Make sure it doesn't spawn on the snake
    //Could be optimized. But any modern system wouldn't have an issue with this, so fuck it!
    while(true){
        pelletX = Math.floor(Math.random() * res) * squareSize;
        pelletY = Math.floor(Math.random() * res) * squareSize;

        if(getColor(pelletX, pelletY, squareSize, squareSize) !== 255)
            break;
    }
}
var lastDir = -1;
function updateSnakeEater(dir){
    //Not the most elegant solution, but it'll do.
    if(snakeLength > 0){
        //Debug stuff.
        /*console.log("SIZE (REAL): " + snakeEater.length);
        console.log("SIZE (SNAKE): " + snakeLength);
        console.log("Snake eater: " + snakeEater);
        console.log("snake Last: " + snakeEater[snakeEater.length-1])*/

        //Looks up the tail from the head and clears the end square.
        var fx = x;
        var fy = y;
        for(var d = 0; d < snakeEater.length; ++d){

            if(snakeEater[d] == DIR_UP)
                fy += squareSize;
            else if(snakeEater[d] == DIR_RIGHT)
                fx -= squareSize;
            else if(snakeEater[d] == DIR_DOWN)
                fy -= squareSize;
            else if(snakeEater[d] == DIR_LEFT)
                fx += squareSize;
        }
        context.clearRect(fx,fy, squareSize, squareSize);
        

        //Add to the array when snakeLength increases.
        if(snakeLength == snakeEater.length)
            snakeEater.shift();
        snakeEater.push(dir);
    }else{
        context.clearRect(x,y, squareSize, squareSize);
    }
}
function setSnakeDir(dir){
    if(snakeDir == DIR_UP && dir != DIR_DOWN)
        snakeDir = dir;
    else if(snakeDir == DIR_RIGHT && dir != DIR_LEFT)
        snakeDir = dir;
    else if(snakeDir == DIR_DOWN && dir != DIR_UP)
        snakeDir = dir;
    else if(snakeDir == DIR_LEFT && dir != DIR_RIGHT)
        snakeDir = dir;
    else if(!playing){
        playing = true;
        snakeDir = dir;
    }
}

function getColor(cx, cy){
    var d = context.getImageData(cx, cy, squareSize,squareSize).data;
    var col = d[0];
    return col;
}
function deviceType () {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};