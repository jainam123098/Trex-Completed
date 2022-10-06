var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImg;
var obstacle,obstacle1,obstacle2,obstacle3, obstacle4, obstacle5,obstacle6;
var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound, checkPointSound, dieSound;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImg = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver1.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound('checkpoint.mp3');
  dieSound = loadSound("die.mp3");
}

function setup() {

  createCanvas(windowWidth, windowHeight);

  //create a trex sprite
  trex = createSprite(50, height-70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("circle",0,0,40);

  //create a ground sprite
  ground = createSprite(width/2, height-70, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  
  gameOver = createSprite(width/2,height/2-100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.2;

  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  //creating invisible ground
  invisibleGround = createSprite(width/2, height-60, width, 10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //generate random numbers
  var rand = Math.round(random(1, 100))
  //console.log(rand)

  score = 0;

}

function draw() {
  //set background color
  background(255);

  console.log(trex.y)
  textSize(20);
  text("Score: "+score, width-150,50);
  

  if(gameState===PLAY){
    ground.velocityX = -(4+score/100);
    gameOver.visible = false;
    restart.visible = false;
    score = score+Math.round(getFrameRate()/60);
    // jump when the space key is pressed
    if (touches.length>0 || keyDown("space") && trex.y >= 570) {
      trex.velocityY = -13;
      jumpSound.play();
      touches = []; 
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if(score>0 && score%1000===0){
      checkPointSound.play();
    }

    //Spawn Clouds
    spawnClouds();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      gameState=END;
      dieSound.play();
      ///trex.velocityY = -13;
      //jumpSound.play();
    }

  }
  else if(gameState===END){
    ground.velocityX = 0;
    trex.changeAnimation("collided", trex_collided);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)){
      console.log("restart is pressed");
      reset();
    }
  }

  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_running);
}

//function to spawn the clouds
function spawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(width, height/2, 40, 10);
    cloud.addImage(cloudImg);
    cloud.y = Math.round(random(50, height/2));
    cloud.scale = 0.75;
    cloud.velocityX = -3;

    cloud.lifetime = width/3;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    console.log(trex.depth);
    console.log(cloud.depth);
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(width, height-80, 10, 40);
    obstacle.velocityX = -(6+score/100);

    var rand = Math.round(random(1, 6));

    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;

      case 2: obstacle.addImage(obstacle2);
        break;

      case 3: obstacle.addImage(obstacle3);
        break;

      case 4: obstacle.addImage(obstacle4);
        break;

      case 5: obstacle.addImage(obstacle5);
        break;

      case 6: obstacle.addImage(obstacle6);
        break;

      default:break;
    }
    obstacle.scale=0.5;
    obstacle.lifetime=width;
    obstaclesGroup.add(obstacle);
  }
}
