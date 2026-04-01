const groundY = 440;
const basePosition = 260;
let maxBullets = 5;
let reloadDelay = 1500;

let player;

let horde;

let rock;
let rockVelocity = 4;

let door;
let doorVelocity = 3;

let bullets = [];

let score = 0;
let rocksDodged = 0;

let gravity = 0.6;
let jumpPower = -12;
//let misplaced = false;
//let collided = false;
let bulletsAmount = maxBullets;
let reloadStartTime = 0;
let isReloading = false;

let backgroundImg;
let playerRunning;
let playerGun;
let hordeAnim;

let rockImg, doorImg, doorBrokenImg;

function preload() {
    backgroundImg = loadImage("sky.png");
    rockImg = loadImage("rock.png");

    doorImg = loadImage("door.png");
    doorBrokenImg = loadImage("door-broken.png");

    floorImg1 = loadImage("floor1.png");
    floorImg2 = loadImage("floor2.png");

    playerRunning = loadAnimation(
        "./running/running0.png",
        "./running/running1.png",
        "./running/running2.png",
        "./running/running3.png",
        "./running/running4.png",
        "./running/running5.png"
    );

    playerGun = loadAnimation(
        "./gun/gun0.png",
        "./gun/gun1.png",
        "./gun/gun2.png",
        "./gun/gun3.png",
        "./gun/gun4.png",
        "./gun/gun5.png"
    );
    hordeAnim = loadAnimation("./horde/horde0.png","./horde/horde1.png");

}

function setup() {
    createCanvas(1200, 600)

    player = createSprite(basePosition,370,40,70);
    player.addAnimation("running",playerRunning);
    player.addAnimation("shooting",playerGun);
    player.changeAnimation("running");
    player.velocity.y = 0;
    player.jump = false;

    horde = createSprite(60,290,120,300);
    horde.addAnimation("horde",hordeAnim);

    rock= createSprite(width, 420, 50, 35);
    rock.addImage(rockImg);

    door = createSprite(width, 330, 65, 140);
    door.addImage("closed",doorImg);
    door.addImage("broken",doorBrokenImg);
    door.broken = false;

    bullets = new Group()
    /*let runningFrames = runningSpriteData.frames;
    for (let i = 0; i < runningFrames.length; i++) {
        let pos = runningFrames[i].position;
        let img = runningSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
        runningAnimation.push(img);
    } */
    /*for(let i = 0;i < totalFrames; i++){
        let frame = runningSpriteSheet.get(
            i*frameWidth,
            0,
            frameWidth,
            frameHeight,
        );
        runningFrames.push(frame);
    }*/
}

function draw(){
    background(backgroundImg);
    updateGame();
    drawGame();
    /*cxt.fillStyle = "#b38c29";
    cxt.font = "16px Arial";
    if(isReloading){
        cxt.fillText("Recarregando!", canvas.width - 170, 60);
    }
    else {
        cxt.fillText(`Munição: ${bulletsAmount} de ${maxBullets}`, canvas.width - 170, 60);
    }*/

    /*cxt.fillStyle = "blue";
    cxt.fillRect(player.x, player.y, player.w,player.h);

    cxt.fillStyle = "#183b26";
    cxt.fillRect(0, 440, canvas.width, 160);

    cxt.fillStyle = "#363636";
    cxt.fillRect(rock.x,rock.y,rock.w,rock.h);

    if(!door.broken){
        cxt.fillStyle = "#a76f3b";
        cxt.fillRect(door.x, door.y, door.w, door.h);
    }
    else {
        cxt.save();
        cxt.globalAlpha = 0.3;
        cxt.fillStyle = "#a76f3b"
        cxt.fillRect(door.x, door.y, door.w, door.h);
        cxt.restore();
    }

    cxt.fillStyle = "#00ab3c";
    cxt.fillRect(0, 140, 120, 300);

    cxt.fillStyle = "#b38c29";
    for(let bullet of bullets){
        cxt.fillRect(bullet.x, bullet.y, bullet.w, bullet.h)
    };

    cxt.fillStyle = "#46a530";
    cxt.font = "16px Arial";
    cxt.fillText(`Pontuação: ${score}`, canvas.width - 170, 30);

    cxt.fillStyle = "#363636";
    cxt.font = "16px Arial";
    cxt.fillText(`Pedras Desviadas: ${rocksDodged}`, canvas.width - 170, 90);*/



}

function updateGame(){
    player.velocity.y += gravity;
    if (player.position.y + player.height/2 >= groundY){
        player.position.y = groundY - player.height / 2;
        player.velocity.y = 0;
        player.jump = false;
    }
    /*player.y += player.vy;
    if(player.y + player.h < groundY){
        player.vy += gravity;
    }
    else {
        player.y = groundY - player.h;
        player.vy = 0;
        player.jump = false;
    }*/


    rock.position.x -= rockVelocity;
    if (rock.position.x < -30){
        rock.position.x = width;
        if(rockVelocity<20){
            rockVelocity += 0.25;
            //rockCounted = false;
        }
    }

    door.position.x -= doorVelocity;
    if (door.position.x < -30){
        door.position.x = width;
        if(doorVelocity < 15){
            doorVelocity += 0.375;
            door.broken = false;
            door.changeImage("closed");
            // Testar colisão da porta depois da velocidade 15
        }
    }

    if(player.overlap(rock)){
        player.position.x -= rockVelocity;
    }
    if(!door.broken && player.overlap(door)){
        player.position.x -= rockVelocity;
    }

    /*if(isColliding(player,rock)){
        player.x -= rockVelocity;
    }
    if(!door.broken && isColliding(player,door)){
        player.x -= doorVelocity;
    }*/

    for(let i = bullets.length-1;i >= 0; i--){
        let b = bullets[i];
        b.position.x+=b.speed;
        if(!door.broken && b.overlap(door)){
            door.broken = true;
            door.changeImage("broken");
            b.remove();
            //bullets.splice(i,1);
            //break;
        }
        if(b.position.x > width){
            b.remove();
            //bullets.splice(i,1);
        }
    }
    if(isReloading && millis()-reloadStartTime>=reloadDelay){
        bulletsAmount = maxBullets;
        isReloading = false;
    }

    if(player.overlap(horde)){
        alert("Os zumbis te derrotaram!🧟");
        resetGame();
    }
    score++;
}

function drawGame(){
    fill("#183b26");
    rect(0,groundY,width,height-groundY);


    /*image(rockImg,rock.x,rock.y,rock.w,rock.h);
    if(!door.broken){
        image(doorImg,door.x,door.y,door.w,door.h);
    }
    else {
        image(doorBrokenImg,door.x,door.y,door.w,door.h);
    }*/


    fill("#46a530");
    textSize(16);
    text(`Pontuação: ${score}`, width - 170, 30);

    fill("#363636");
    text(`Pedras Desviadas: ${rocksDodged}`, width - 170, 90);

    if(isReloading){
        fill("#b38c29");
        text(`Recarregando!`, width - 170, 90);
    }
    else {
        fill("#b38c29");
        text(`Munição: ${bulletsAmount} de ${maxBullets}`, width - 170, 60);
    }

    drawSprites();
}


function keyPressed() {
    if(key === " " && !player.jump){
        player.velocity.y = jumpPower;
        player.jump = true;
    }
}

function mousePressed(){
    if(isReloading) return;
    
    if(bulletsAmount <= 0){
        isReloading = true;
        reloadStartTime = millis();
        return;
    }

    let bullet = createSprite(
        player.position.x + player.width/2,
        player.position.y,
        10,
        5
    );

    bullet.shapeColor = "#b38c29";
    bullet.speed = 8;
    bullets.add(bullet);

    /*bullets.push({
        x: player.x + player.w,
        y: player.y + player.h / 2,
        w: 10,
        h: 5,
        speed: 8,
    });*/

    bulletsAmount--;

    player.changeAnimation("shooting");

    setTimeout(() => {
        player.changeAnimation("running");
    },200);

    if(bulletsAmount == 0){
        isReloading = true;
        reloadStartTime = millis();
    }
}

/*function isColliding(a,b){
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}*/

function resetGame(){
    player.position.x = basePosition;

    rockVelocity = 4;
    doorVelocity = 3;

    door.broken = false;
    door.changeImage("closed");

    rock.position.x = width;
    door.position.x = width;

    score = 0;
    rocksDodged = 0;

    bullets.removeSprites();
}

/*function update() {
    collided = false;

    player.y += player.vy;
    if (player.y + player.h < groundY){
        player.vy += gravity;
    }
    else {
        player.y = groundY - player.h;
        player.vy = 0;
        player.jump=false;
    }

    rock.x -= rockVelocity;
    if(rock.x < -30 ){
        rock.x = 820;
        if(rockVelocity<20){
            rockVelocity += 0.25;
            rock.counted = false;
            console.log("Velocidade da pedra: ", rockVelocity);
        }
    }
    if (rock.x + rock.w < player.x && !rock.counted){
        rocksDodged++;
        rock.counted = true;
        console.log("Pedras contadas: ", rocksDodged);
    }

    //doorVelocity = -(Math.floor(Math.random()*4))
    door.x -= doorVelocity;
    if(door.x < -30 ){
        door.x = 820;
        if(doorVelocity<15){
            doorVelocity += 0.375;
            door.broken = false;
            console.log("Velocidade da porta: ", doorVelocity);
        }
    }

    if(
        player.x < rock.x + rock.w &&
        player.x + player.w > rock.x &&
        player.y < rock.y + rock.h &&
        player.y + player.h > rock.y
    ){
        if(player.y != rock.y)player.x -= 5;
        collided = true;
        player.x -= rockVelocity;
         //console.log("Pedra colidiu com player?: ", collided);
    }

    if(player.x < basePosition && !collided)
        {
            misplaced = true;
        }

    if(misplaced){
        player.x += 1;
        if(player.x >= basePosition){
            player.x = basePosition;
            misplaced = false;
        }
        console.log(misplaced);
    }

    for(let i = bullets.length-1;i>=0;i--){
        bullets[i].x+=bullets[i].speed;

        if(!door.broken && isColliding(bullets[i],door)){
            door.broken = true;
            bullets.splice(i,1);
            //console.log("Porta destruída!");
            break;
        } 

        if(bullets[i].x > canvas.width){
            bullets.splice(i,1);
        }
    }

    if(
        player.x < horde.x + horde.w &&
        player.x + player.w > horde.x
    ) {
        alert("Os zumbis te derrotaram!🧟");
        player.x = 260
        rockVelocity = 4;
        doorVelocity = 3;
        door.broken = false;
        rock.x = canvas.width;
        door.x = canvas.width;
        score = 0;
        rocksDodged = 0;
    }

    if(!door.broken && isColliding(player,door)){
        player.x -= doorVelocity;
        collided = true;
        //console.log("Porta colidiu com player?: ", collided);
    }


    if(isReloading){
        if(Date.now()-reloadStartTime >= reloadDelay){
            bulletsAmount = maxBullets;
            isReloading = false;
            console.log ("Arma recarregada!");
        }
    }

    if(!isColliding(player,horde)){
        score++;
    }

    draw();
    requestAnimationFrame(update);
}


function mousePressed() {
    shoot();
}



/*document.addEventListener("keydown", (tecla) => {
    if(tecla.code === "Space" && !player.jump){
        player.vy = jumpPower;
        player.jump = true;
    }
})

document.addEventListener("click", function(){
    if(isReloading) {
        console.log("Recarregando!");
        return;
    }

    if(bulletsAmount <= 0){
        isReloading = true;
        reloadStartTime = Date.now();
        console.log("Pente vazio!");
        return;
    }

    bullets.push({
        x: player.x + player.w,
        y: player.y + player.h/2,
        w: 8,
        h: 5,
        speed: 6,
    });

    bulletsAmount--;

    if(bulletsAmount === 0){
        isReloading = true;
        reloadStartTime = Date.now();
        console.log("Última bala disparada!");
    }

    console.log("Disparo efetuado. - Munição: ", bulletsAmount);
})*/

//update()