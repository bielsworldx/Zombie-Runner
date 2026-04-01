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

let bullets;

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

    horde = createSprite(60,305,120,300);
    horde.addAnimation("horde",hordeAnim);

    rock= createSprite(width, 420, 50, 35);
    rock.addImage(rockImg);

    door = createSprite(width, 394, 65, 140);
    door.addImage("closed",doorImg);
    door.addImage("broken",doorBrokenImg);
    door.broken = false;

    bullets = new Group()

    player.setCollider("rectangle",-15,0,30,85);
    player.debug = true;

}

function draw(){
    background(backgroundImg);
    updateGame();
    drawGame();

}

function updateGame(){
    player.velocity.y += gravity;
    if (player.position.y + player.height/2 >= groundY){
        player.position.y = groundY - player.height / 2;
        player.velocity.y = 0;
        player.jump = false;
    }


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
        player.position.x -= doorVelocity;
    }

    for(let i = bullets.length-1;i >= 0; i--){
        let b = bullets[i];
        b.position.x+=b.speed;
        if(!door.broken && b.overlap(door)){
            door.broken = true;
            door.changeImage("broken");
            b.remove();
        }
        if(b.position.x > width){
            b.remove();
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

    bulletsAmount--;

    player.changeAnimation("shooting");

    setTimeout(() => {
        player.changeAnimation("running");
    },400);

    if(bulletsAmount == 0){
        isReloading = true;
        reloadStartTime = millis();
    }
}


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

    if (rock.x + rock.w < player.x && !rock.counted){
        rocksDodged++;
        rock.counted = true;
        console.log("Pedras contadas: ", rocksDodged);
    }


    if(){
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
}*/


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
})

//update()*/