const tcDeadZone = 30;
var sx, sy;
var ex, ey;

function initTouchControls(){
    sx = 0;
    sy = 0;
    ex = 0;
    ey = 0;
    window.addEventListener("touchstart", (e) => {

        //Get the start touch
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
    });
    window.addEventListener("touchend", (e) => {
        var dirVal = -1;

        //Get the end touch
        ex = e.changedTouches[0].clientX;
        ey = e.changedTouches[0].clientY;

        //Delta X and Y
        var dx = sx - ex;
        var dy = sy - ey;
        
        //Check if it's a Y or X direction
        var adx = Math.abs(dx);
        var ady = Math.abs(dy);

        if(adx > ady && adx > tcDeadZone){
            if(dx < 0)
                dirVal = DIR_RIGHT;
            else if(dx > 0)
                dirVal = DIR_LEFT;
        }else{
            if(dy < 0)
                dirVal = DIR_DOWN;
            else if(dy > 0)
                dirVal = DIR_UP;
        }

        //console.log("Delta XY: " + dx + " - " + dy);
        if(dirVal != -1)
            setSnakeDir(dirVal);
    });
}
