let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
/*let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);*/
let paddleHeight = 10;
let paddleWidth = 90;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 5;
let brickColumnCount = 8;
let brickWidth = 109; /* 75; is orginal width, but 120 looks better*/
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let ballColor = "#0095DD";
let score = 0;
let lives = 3;
const pop = new Audio('Pop1.m4a');
const kuh = new Audio('Kuh1.m4a');
const ohNo = new Audio('Oh no!.m4a');
const Tada = new Audio('Tada1.m4a');

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    /*             if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    } original code allows paddle to go to far off screen*/
    if (relativeX > 38 && relativeX < canvas.width - 38) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    kuh.play();
                    /*ballColor = randomColor;*/
                    score++; /*score = (score + 2); change the amount of pts awarded per brick broken*/
                    if (score === brickRowCount * brickColumnCount) {
                        Tada.play();
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}


function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            /* dy = -dy * 1.2; substitution for code on same line;
                               increases speed of ball everytime it hits the paddle*/
        } else {
            pop.play();
            lives--;
            if (!lives) {
                ohNo.play();
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    /*if (dx>0 && dy>0){
        ctx.fillStyle = "red";
        ctx.fill();  
    }
    if (dx>0 && dy<0){
        ctx.fillStyle = "#0095DD";
        ctx.fill();  
    }
    if (dx<0 && dy>0){
        ctx.fillStyle = "black";
        ctx.fill();  
    }
    if (dx<0 && dy<0){
        ctx.fillStyle = "green";
        ctx.fill();  
    } change colors for different directions*/

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
        /*if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        } orignial code for paddle movement, before consolidation*/
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
        /*if (paddleX < 0) {
            paddleX = 0;
        } orignial code for paddle movement, before consolidation*/
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();