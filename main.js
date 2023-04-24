
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let bakcgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let score = 0;
let gameOver = false // true - game over

let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

let bulletList = []
function Bullet () {
    this.x = 0;
    this.y = 0;
    this.init=function(){
        this.x = spaceshipX + 12;
        this.y = spaceshipY;
        this.alive = true;

        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 20;
    };

    this.checkHit = function() {
        for(let i = 0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40){
                score++;
                this.alive = false;
                enemyList.splice(i,1);
            }
        }  
    };
}

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max - min + 1))+min;
    return randomNum;
}

let enemyList = []
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width - 48);
        
        enemyList.push(this);
    };

    this.update = function(){
        this.y += 2

        if(this.y >= canvas.height - 48){
            gameOver = true;
            //console.log ("gameOver")
        }
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src="images/bullet.png";

    enemyImage = new Image();
    enemyImage.src="images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src="images/gameover.png";
}

let keysDown = {};
function setupKeybaordListener() {
    document.addEventListener("keydown", function (event) {
        keysDown[event.key] = true;
    });
    document.addEventListener("keyup", function (event) {
        delete keysDown[event.key];
        //console.log("what's keydown", event.key);
        if(event.keyCode == 32){
            createBullet();
        }
    });
}

function createBullet() {
    console.log("bullet make");
    let b = new Bullet();
    b.init();
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    },1000);
}

function update() {
    if ('ArrowRight' in keysDown) {
        spaceshipX += 5;
    } //right
    if ('ArrowLeft' in keysDown) {
        spaceshipX -= 5;
    } //left

    if(spaceshipX <=0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width - 64){
        spaceshipX = canvas.width - 64;
    }

    for(let i = 0; i < bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    for(let i = 0; i < enemyList.length; i++){
        enemyList[i].update();
    }
}


function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText('Score', 20, 30);
    ctx.fillText(score, 20, 60);
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";

    for (let i = 0; i < bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }        
    }

    for (let i = 0; i < enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
    
}

function main() {
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);

    }else{
        ctx.drawImage(gameOverImage, 20, 200, 380, 195);
    }
}

loadImage();
setupKeybaordListener();
createEnemy();
main();