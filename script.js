/* Space-Game
* Welcome Panel
* BackGround Audio, Sound Icon, Video
* Game Player and Enemy 
* Score Count
* Lives Count
* Game Main Objects Movement
* Player movement Controls, Shooting EnemyShip
* Destroying Player upon Collision
* Game End Upon No Lives 
*/
// Defining Canvas and setting Context to 2d to draw images
const canvas= document.getElementById("GameCanvas");
const ctx= canvas.getContext("2d");
// Game control Variables
let video;
const soundButton= new Image(); // Sound Icon as image Initialization
let gameInitialized= false; // Flag for Game Initialization
let videoReady= false; // Flag for video loading
// Declaration & Definition for Variables
let score=0; 
let gameObjects = [];
let gameloop;
let player; 
const keysPressed = {}; // To track currently pressed keys for continuous movement
let enemy;
// Game Assets Image
    let playerImg,
        enemyShip,
        lifeImg,
        playerRightImg,
        playerLeftImg,
        playerDamageImg;
let LaserImage,collisionLaserImage,collisionPlayerImage;
// Declaration & Definision of messages
  const Messages={
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_SPACE:"KEY_EVENT_SPACE",
    KEY_EVENT_ENTER:"KEY_EVENT_ENTER",
    COLLISION_LASER_ENEMY:"COLLISION_LASER_ENEMY",
    COLLISION_PLAYER_ENEMY:"COLLISION_PLAYER_ENEMY",
    GAME_END_LOSS:"GAME_END_LOSS",
    GAME_END_WIN:"GAME_END_WIN",
    GAME_END_LOSS_ENEMY_WIN:"GAME_END_LOSS_ENEMY_WIN",
  };
// Function to Control Game Canvas Display 
async function Display(){
    
    // Clear Canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Loading assets in parallel before starting the game loop
    await  backgroundVideo();
    // Draw Video
    drawVideoFrame();
    // Loading Game Assets
    playerImg= await AssetsImageLoad('spaceArt/player.png');
    playerRightImg= await AssetsImageLoad('spaceArt/playerRight.png');
    playerLeftImg= await AssetsImageLoad('spaceArt/playerLeft.png');
    playerDamageImg= await AssetsImageLoad('spaceArt/playerDamaged.png');
    enemyShip= await AssetsImageLoad('spaceArt/enemyShip.png');
    lifeImg=await AssetsImageLoad('spaceArt/life.png');
    LaserImage= await AssetsImageLoad('spaceArt/laserRed.png');
    collisionLaserImage= await AssetsImageLoad('spaceArt/laserRedShot.png');
    collisionPlayerImage= await AssetsImageLoad('spaceArt/laserGreenShot.png');
    // Background Sound and Icon 
    await backgroundAudio();
    drawSoundIcon();
    StartGameFrame();
    gameLoop(); // Begin Main game Loop

}
 // Function to handle Background Video
async function backgroundVideo(){

    return new Promise((resolve)=>{

        // Creating Video Element for Background using DOM
        video= document.createElement("video");
        video.src= "spaceArt/Background/starry-background.mp4";
        video.playsinline= true;
        video.loop=true;
        video.muted=true; 
        video.play();
        video.addEventListener("canplaythrough",()=>{
            videoReady=true; //  Flag for video is Ready
            resolve(); 
        });

    });
}
// Function to Draw Video Frame
   function drawVideoFrame(){
            ctx.drawImage(video,0,0,canvas.width,canvas.height);
  }
// Function to handle Background Audio with Sound Icon
async function backgroundAudio(){

    return new  Promise((resolve)=>{
   
    // audio DOM Element Creation
     const bgMusic= document.createElement('audio');
     bgMusic.src= "spaceArt/Background/BackgroundSound.wav";
     bgMusic.loop=true; 
     bgMusic.volume=0.2;
     document.body.appendChild(bgMusic); // Ensuring Audio element is part of DOM

     // Variable Declaration & Definition
     let isplaying=false;
     soundButton.src="spaceArt/Background/muteIcon.png";
     
     // Icon Position Definition
     const iconX=canvas.width-50;
     const iconY=20;
     const iconSize=30;
     
        
   // Loading sound Icon 
     soundButton.onload=()=>{
        drawSoundIcon();
        resolve();
      };   
    
      
     // Click Event Listener in Canvas for Toggling Sound
     canvas.addEventListener("click",(event)=>{

        // Gets Canvas X and Y Coordinates
        const rect= canvas.getBoundingClientRect();
        //  Getting X Coordinate of  Click Event in Canvas 
        const clickX= event.clientX-rect.left;
        // Getting Y Coordinate of Click Event in Canvas
        const clickY=event.clientY-rect.top;

        // Checking X and Y coordinates of Click Event is inside SoundIcon
        if (clickX>=iconX && clickX<=iconX+iconSize && clickY>=iconY && clickY<=iconY+iconSize){

            // Changing state of Playing
            isplaying=!isplaying;

            // Updating  Sound Button
            soundButton.src= isplaying ? "spaceArt/Background/volumeIcon.png" : "spaceArt/Background/muteIcon.png";
           

           // Updating Background Sound
            bgMusic[isplaying?"play":"pause"]();

            // Redrawing Sound Icon
            drawSoundIcon();
                            
            }

         });
    });
 } 
// Function to Draw Sound Icon
    function drawSoundIcon(){

    // Icon Position
     const iconX=canvas.width-50;
     const iconY=20;
     const iconSize=30;
        ctx.clearRect(iconX,iconY,iconSize,iconSize);
        ctx.drawImage(soundButton,iconX,iconY,iconSize,iconSize);
    }
// Function for start screen
 async function StartGameFrame(){
   // Calling Start Screen Text Element
   const startScreen= document.getElementById("startScreen");

   startScreen.addEventListener("click",()=>
   {
        startScreen.style.display="none";
            if(!gameInitialized){
            initializeGame();
            gameInitialized=true;
        }
   });
             
 }
 // Function to Control Main Game Loop
 function gameLoop(){

   gameloop= setInterval(()=>{
    // Clear Canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    backgroundObjects();
   // Draw game assets only after game starts
    if (gameInitialized && player){ 
        UpdateGameObjects();
        drawScore();
        drawLives(); 
        drawGameObjects();
    }
 },100);
      
}
function backgroundObjects(){
// Draw background Video if it is ready
    if (videoReady){
        // Draw Video Frame
        drawVideoFrame();
        // Draw Sound Icon
        drawSoundIcon();
    }
    
}
  // Function to load game images in canvas
 async function AssetsImageLoad(path){

    return new Promise((resolve)=>{
        const image= new Image();
        image.src=path;
        image.onload = () =>{
            resolve(image);
        }; 

    });
}
  // Class to Handle Drawing Game Objects in a Centralized Control 
 class DrawGameObject{

    constructor(x,y){
        this.x=x;
        this.y=y;
        this.dead=false;
        this.width=0;
        this.height=0;
        this.type="";
        this.isDying = false;      
        this.hasBeenDying = false; // property to ensure one draw cycle in dying state
        this.img=undefined;
    }
     draw(){
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height); 
     }

     //Getting Rectangle Representation of Game Object
     getRectofGameObject(){
        return {
            left:this.x,
            right:this.x+this.width,
            top:this.y,
            bottom:this.y+this.height,
        }
     }
}
/* OOP Inheritance or Composition
* Creating Class for Game Objects Player, Enemy, Laser declaring its attributes
* Inheriting super Class attributes and Drawing Game Objects in Functions
*/
// Class to Handle Player Movement in Game
class Player extends DrawGameObject{
    constructor(x,y){
        super(x,y);
        this.type="player";
        this.speedVal = 7;      // Movement speed in pixels per game tick
        this.cooldown=0;        // Counter for fire cooldown
        this.fireInterval = 500;  // Cooldown ticks (50 * 100ms = 5000ms)
        this.life=3;
        this.score=0;
        this.isDamaged = false; // Flag for persistent damaged state
    }

    fire(){
        gameObjects.push(new Laser(this.x+45,this.y-10))
        this.cooldown=500;
       let id=setInterval(()=>{
            if(this.cooldown>0){
                this.cooldown-=100; 
            if(this.cooldown===0){ 
               clearInterval(id);     
             }
            }
        },200);
        this.cooldown = this.fireInterval; // Set cooldown ticks
    }
    canFire(){
        return this.cooldown<=0;
    }

    updateMovement() {
        let movedHorizontal = false;
        if (keysPressed["ArrowUp"]) {
            let newY = this.y - this.speedVal;
            if (newY >= 0) this.y = newY;
        }
        if (keysPressed["ArrowDown"]) {
            let newY = this.y + this.speedVal;
            if (newY <= canvas.height - this.height) this.y = newY;
        }
        if (keysPressed["ArrowLeft"]) {
            let newX = this.x - this.speedVal;
            if (newX >= 0) this.x = newX;
            movedHorizontal = true;
            if (!this.isDamaged && !this.isDying) this.img = playerLeftImg;
        }
        if (keysPressed["ArrowRight"]) {
            let newX = this.x + this.speedVal;
            if (newX <= canvas.width - this.width) this.x = newX;
            movedHorizontal = true;
            if (!this.isDamaged && !this.isDying) this.img = playerRightImg;
        }

        if (!movedHorizontal && !this.isDamaged && !this.isDying) {
            this.img = playerImg; // Default image if not moving L/R and not damaged/dying
        }
    }
    // Function to decreament Life
    decrementLife(){ 
        this.life--;
        console.log("-1");
        if (this.life === 0) {
            // Instead of directly setting dead, initiating the dying sequence
            this.isDying = true;
            this.hasBeenDying = false;
            this.img = collisionPlayerImage; // Set to green laser shot on final death
            console.log("Dead");
        }
    }
    // Function to increament Points
    increamentPoints(){
        this.score+=100;
    }

}
// Class to Handle Enemy Movements in Game
  class Enemy extends DrawGameObject{

    constructor(x,y){
        super(x,y);
        this.type="enemy";
        const moveDownBy=5;
    
    let id= setInterval(()=>{

        // Condition Checking If enemy is within Canvas Boundary
        if (this.y<canvas.height-this.height){
            this.y+=moveDownBy;
        }
        else{
             this.dead=true;
             clearInterval(id);
        }
    },1000);
}
}
// Class to Handle Player Laser
class Laser extends DrawGameObject{
    constructor(x,y){
        super(x,y);
        this.type="laser";
        this.width=9;
        this.height=33;
        this.img=LaserImage;
        const moveUpByVal=15;

        let id= setInterval(()=>{
            if(this.y>0){
            this.y-=moveUpByVal;
             }
            else {
            this.dead=true;
            clearInterval(id);
        }
        },100);
        }
    }

// Function to Create Player
function CreatePlayer(playerImg){

let x=(canvas.width/2)-45;
let y=canvas.height-canvas.height/4;
player= new Player(x,y);
player.img=playerImg;
player.width=playerImg.width;
player.height=playerImg.height;
gameObjects.push(player);
}
// Function to Create Enemy
function CreateEnemy(enemyShip){
      
    const enemyCount=5;
    const enemyWidth= enemyCount*98;
    const enemyStart_X= (canvas.width-enemyWidth)/2;
    const enemyStop_X= enemyStart_X+enemyWidth;
    const enemyHeight=50;
    const enemyStopY=enemyHeight*enemyCount;
     // Drawing 5*5 EnemyShips
     for (let x =enemyStart_X; x <enemyStop_X; x+=98){
        for (let y=0; y<enemyStopY; y+=enemyHeight){
           enemy=new Enemy(x,y);
           enemy.img=enemyShip;
           enemy.width=enemyShip.width;
           enemy.height=enemyShip.height;
           gameObjects.push(enemy);
        }
     }
}
// Function to Control and Display Score
function drawScore(){    
    const rectX=10;
    const rectY=10;
    const rectWidth=170;
    const rectHeight=40;

    ctx.fillStyle="rgba(0,0,0,0.5)";
    ctx.fillRect(rectX,rectY,rectWidth,rectHeight);
    ctx.fillStyle="white";
    ctx.font=" bold 30px Arial"; 
    ctx.fillText("Score: " + player.score, rectX+60,rectY+rectHeight-10);
  
}
// Function to draw player lives dynamically
function drawLives() {
    // Ensuring player and life image are loaded before drawing
    if (!player || !lifeImg || !lifeImg.width || !lifeImg.height) { 
        return;
    }

    // Declaration & Definition of Life Object Variables
    const lifeIconWidth = lifeImg.width ; 
    const lifeIconHeight = lifeImg.height ; 
    const lifeSpacing = 5;
    const startY = canvas.height-canvas.height/4 + 20;
    const totalLivesWidth = player.life * lifeIconWidth + (player.life > 0 ? (player.life - 1) * lifeSpacing : 0);
    const startX = canvas.width - totalLivesWidth - 20; 

    for (let i = 0; i < player.life; i++) {
        ctx.drawImage(lifeImg, startX + i * (lifeIconWidth + lifeSpacing), startY, lifeIconWidth, lifeIconHeight);
    }
}
//Function to Check is Player Dead
function isHeroDead(){
    return player.life<=0;
}
// Function to Check Enemies Dead
function isEnemiesDead(){
    const enemies= gameObjects.filter(obj=>obj.type ==="enemy" &&!obj.dead);
    return enemies.length===0;
}
// Function to End Game
function endGame(win){
    clearInterval(gameloop); 

    // Setting Delay to paint out all Game Objects
    
    setTimeout(()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        backgroundObjects();
        if(win){
         
           drawMessage("👽 💥 🚀 Congratulations, Captain! Your Mission is complete! 🚀 💥 👽 \n \n Press [ENTER] to Restart Game! 💥", canvas.width/2, canvas.height/2 - 30, 30, "center");
        }
        else{
          
           drawMessage("💥 Mission Failed! 💥 You Lost! 👽 \n \n Press [ENTER] to Restart Game! 💥", canvas.width/2, canvas.height/2 - 30, 30, "center");
            }
         gameInitialized=false;
    },300);
      

}
// Function to draw Message
function drawMessage(message, x, y, lineheight, textAlign = "left") {
    const originalTextAlign = ctx.textAlign;
    ctx.textAlign = textAlign;
    ctx.fillStyle="white";
    ctx.font="bold 30px Arial";
    const lines = message.split("\n");
    lines.forEach((line,index)=>{
        ctx.fillText(line,x,y+index*lineheight);
    });
    ctx.textAlign = originalTextAlign; 
}

// Function to Reset Game 
function resetGame(){
   if(gameloop){
        clearInterval(gameloop);
      gameloop = undefined; 
    }
    eventEmitterObj.clear();
    
    // Reset game state variables
    gameObjects = [];
    score = 0; 
     initializeGame();
     gameInitialized = true; 
     gameLoop();
}


/*Adding Pub-Sub Pattern (Publish & Subscribe Pattern)
* Creating An EventEmitter Class
* Adding Event Listener To Window
*/
class EventEmitter{
    constructor(){
        this.listeners={};
    }

    //  All the Events are Subscribed to this Function.
    //  Storing all the Events 
    sub(message,listener){

        if(!this.listeners[message]){
            this.listeners[message]=[]; // Adds if Listener not Exists
        }
        this.listeners[message].push(listener); // Pushes the message to listener
        }

    // Publishes and Updates message to all subcriptions and Event Listeners with optional Payload
    pub(message,payload=null){
        if (this.listeners[message]){
            this.listeners[message].forEach((listener)=>listener(message,payload));
        }
    }
    // Method to clear all listeners
    clear(){
        this.listeners = {};
    }
 }

 // Declaring and Defining an object of Event listener
    let eventEmitterObj= new EventEmitter();


// Function to setup the Main game Objects
function initializeGame(){
        gameObjects=[];
        CreatePlayer(playerImg);
        CreateEnemy(enemyShip);

        const moveByVal= 10;

        // Getting player instance to move
        const player=gameObjects.find(obj=>obj.type==="player");
    

        if (!player){
            console.log("Player Instance not found in Initialization");
            return;
        }
              
 
        eventEmitterObj.sub(Messages.KEY_EVENT_SPACE,()=>{
            if(player && player.canFire()){
                player.fire();
            }
        });

        eventEmitterObj.sub(Messages.COLLISION_LASER_ENEMY,(_,{gameObject1,gameObject2})=>{
            gameObject1.dead=true;
            gameObject2.img = collisionLaserImage; 
            gameObject2.isDying = true;            
            gameObject2.hasBeenDying = false;      // Reset for dying sequence
            player.increamentPoints();
            
        });

        eventEmitterObj.sub(Messages.COLLISION_PLAYER_ENEMY,(_,{enemy})=>{
            enemy.img = collisionLaserImage; 
            enemy.isDying = true;             
            enemy.hasBeenDying = false;       // Reset for dying sequence
            
            if (!player.isDamaged) { // Only apply damage effects once visually until reset
                player.img = playerDamageImg;
                player.isDamaged = true;
            }
            player.decrementLife();
        
           if(isHeroDead()){
               eventEmitterObj.pub(Messages.GAME_END_LOSS);
        }
       });
    
        eventEmitterObj.sub(Messages.GAME_END_WIN,()=>{
            endGame(true);
        });
        
        eventEmitterObj.sub(Messages.GAME_END_LOSS,()=>{
            endGame(false);
        });

        eventEmitterObj.sub(Messages.KEY_EVENT_ENTER,()=>{
              resetGame();
        });
    }

    function drawGameObjects(){
        gameObjects.forEach(object=>
            object.draw(ctx));
    }
 // Function for Controlling, Adding Key-Event Handlers and Preventing Default KeyBoard Actions
  function keysControl(e){
    console.log(e.key);
    switch(e.key){
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "ArrowDown":
        case " ": // Space Bar
            e.preventDefault();
            break;
        default:
            break;  
    }
 }
 // Function for Comparing GameObjects
 function intersectRect(rect1,rect2){
    return !(rect2.left>rect1.right ||
        rect2.right<rect1.left ||
        rect2.top>rect1.bottom ||
        rect2.bottom<rect1.top);
 } 
 // Function to Update Collision of Laser and Enemy
 function UpdateGameObjects(){
    const enemies= gameObjects.filter(obj=>obj.type==="enemy");
    const lasers= gameObjects.filter(obj=>obj.type==="laser");


    if (player) {
        
        // Movement events (UP, DOWN, LEFT, RIGHT) are  handled by polling keysPressed
        player.updateMovement(); // Handle continuous movement based on keysPressed
        if (player.cooldown > 0) player.cooldown--; // Update fire cooldown
    }

    // Player Hit Enemies
    enemies.forEach((enemy)=>{
        if(!enemy.isDying){
             const playerRect=player.getRectofGameObject();
             const enemyRect= enemy.getRectofGameObject();
             if (intersectRect(playerRect,enemyRect)){
                eventEmitterObj.pub(Messages.COLLISION_PLAYER_ENEMY,{enemy});
             }
           }  
    });
    // Laser Hit Enemy
    lasers.forEach((laser)=>{
        enemies.forEach((enemy)=>{
            const laserRect=laser.getRectofGameObject();
            const enemyRect= enemy.getRectofGameObject();
            if( intersectRect(laserRect,enemyRect)){
                eventEmitterObj.pub(Messages.COLLISION_LASER_ENEMY,{
                    gameObject1:laser,
                    gameObject2:enemy,
                    });
                           }
        });
    });

    // Handle dying state to show collision image for one frame before removal
    gameObjects.forEach(obj => {
        if (obj.isDying && !obj.hasBeenDying) {
            obj.hasBeenDying = true; 
        } else if (obj.isDying && obj.hasBeenDying) {
            obj.dead = true; 
        }
    });

    gameObjects=gameObjects.filter(obj=>!obj.dead);

    // Check for win condition if game is active and player is alive
    if (gameInitialized && player && !player.dead && !player.isDying) {
        if (isEnemiesDead()) {
            eventEmitterObj.pub(Messages.GAME_END_WIN);
        }
    }
    }
// Trigger Display when game Loads
window.addEventListener("DOMContentLoaded",Display);

window.addEventListener("keydown",(e)=>{
    keysPressed[e.key] = true;
    keysControl(e); // For preventDefault
});

// Adding Event Listener on window
window.addEventListener("keyup",(evt)=>{
    keysPressed[evt.key] = false;

    // Reset player image to default if they were moving horizontally and stopped,
    // and are not damaged or dying.
    if (player && !player.isDamaged && !player.isDying) {
        if (evt.key === "ArrowLeft" || evt.key === "ArrowRight") {
            if (!keysPressed["ArrowLeft"] && !keysPressed["ArrowRight"]) { // Check if both are released
                 player.img = playerImg;
            }
        }
    }

    // Publish discrete events
    if(evt.key===" "){ // Space for firing
        eventEmitterObj.pub(Messages.KEY_EVENT_SPACE);
    }
    else if (evt.key==="Enter"){ // Enter for reset/restart
            eventEmitterObj.pub(Messages.KEY_EVENT_ENTER);
    }
    });
