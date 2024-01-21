let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;
canvas.style.position = "absolute";

const leftC = (window.innerWidth - canvas.width) / 2;
const topC = (window.innerHeight - canvas.height) / 2;
canvas.style.left = leftC + "px";
canvas.style.top = topC + "px";

let platformInitialWidth = 100;
const platform = {
    x: (canvas.width - platformInitialWidth)/2,
    y: canvas.height - 20,
    width: platformInitialWidth,
    height: 15
};

const ball = {
    x: platform.x + platform.width/2,
    y: platform.y - platform.height,
    r: 10,
    dx: 2,
    dy: -2,
    isAlive: true,
    hasStarted: false
}


gameLoop();
function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateBall();

    //draw platform
    ctx.fillStyle = "gray";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)



    requestAnimationFrame(gameLoop);
}

function updateBall(){
    // let futureX = ball.x + ball.dx;
    // let futureY = ball.y + ball.dy;

    //ball movement
    if(ball.hasStarted){
        ball.x += ball.dx;
        ball.y += ball.dy;
    }
    else
        ball.x = platform.x + platform.width/2;
    
    //collision
    collision();

    //draw ball
    if(ball.isAlive){
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    }
}

function collision(){
    //left and right walls
    if(ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width)
        ball.dx = -ball.dx;

    //ceiling
    if(ball.y - ball.r <= 0)
        ball.dy = -ball.dy;

    //platform

// bottom of ball on Y level of platform; bottom of ball not below half height of platform;      ball is between left and right side of platform;        ball is moving down
    if(ball.y + ball.r >= platform.y &&/* ball.y + ball.r < platform.y + platform.height/2 &&*/ ball.x >= platform.x && ball.x <= platform.x + platform.width && ball.dy > 0){
        ball.dy = -ball.dy;
        ball.y = platform.y - ball.r - 1;
    }

    //floor
    if(ball.y + ball.r >= canvas.height){
        ball.isAlive = false;
    }
    
}

document.addEventListener("mousemove",movePlatform);
function movePlatform(e){
    if(e.pageX <= leftC + platform.width/2){
        platform.x = 0;
        return;
    }
    else if(e.pageX >= leftC + canvas.width - platform.width/2){
        platform.x = canvas.width - platform.width;
        return;
    }

    platform.x = e.pageX - leftC - platform.width / 2;
}

document.addEventListener("click", activateBall)
function activateBall(){
    if(!ball.hasStarted)
        ball.hasStarted = true;
}


let scrollPosition = 0;
document.addEventListener("wheel", ballSpeedScroll)
function ballSpeedScroll(e){
    if (e.deltaY < 0) {
        ball.dx *= 1.1;
        ball.dy *= 1.1;
    } else {
        ball.dx *= 0.9;
        ball.dy *= 0.9;
    }
}