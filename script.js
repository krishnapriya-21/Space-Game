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


// Declaring Canvas and setting Context to 2d to draw images
const canvas= document.getElementById("GameCanvas");
const ctx= canvas.getContext("2d");
// Game control Variables
let gameStarted= false;
let video;
const soundButton= new Image(); // Sound Icon as image Initialization
let gameInitialized= false; // Flag for Game Initialization
let videoReady= false; // Flag for video loading
let playerImg,enemyShip,life,LaserImage,playerRightImg,playerLeftImg,playerDamageImg; // Game Assets
let score=0; 
let gameObjects = [];
// Declaration of messages
  const Messages={
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  };
// Function to Control Game Canvas Display 
async function Display(){
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
    life=await AssetsImageLoad('spaceArt/life.png');
    LaserImage= await AssetsImageLoad('spaceArt/laserGreen.png');
    // Background Sound and Icon 
     await backgroundAudio();
    drawSoundIcon();
    StartGameFrame();
    gameloop(); // Begin Main game Loop
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
            videoReady=true; // Set Flag when video is Ready
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

     // Variable Declaration
     let isplaying=false;
     soundButton.src="spaceArt/Background/muteIcon.png";
     
     // Icon Position
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
    // Function to Control Initial Game Screen
 async function StartGameFrame(){
   // Calling Start Screen Text Element
   const startScreen= document.getElementById("startScreen");

   startScreen.addEventListener("click",()=>
   {
        startScreen.style.display="none";
        gameStarted=true;
        if(!gameInitialized){
            initializeGame();
            gameInitialized=true;
        }
   });
             
 }
    // Function to Control Main Game Loop
async function gameloop(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Draw background Video if it is ready
    if (videoReady){
        // Draw Video Frame
        drawVideoFrame();
        // Draw Sound Icon
        drawSoundIcon();
        // Draw game assets only after game starts
    if (gameStarted){
        drawGameObjects(ctx);
        drawScore();
    }
    }
    requestAnimationFrame(gameloop);
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
        this.img=undefined;
    }
     draw(){
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height); 
     }
}
//  Class to Handle Player Movement in Game
class Player extends DrawGameObject{
    constructor(x,y){
        super(x,y);
        this.type="player";
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
            clearInterval(id);
            this.dead=true;
        }

    },1000);
}
}
// Class to Handle Game Life
class Life extends DrawGameObject{
    constructor(x,y){
        super(x,y);
        this.type="life";
    }
}
// Function to control Create Player
function CreatePlayer(playerImg){

let x=(canvas.width/2)-45;
let y=canvas.height-canvas.height/4;
const player= new Player(x,y);
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
           const enemy=new Enemy(x,y);
           enemy.img=enemyShip;
           enemy.width=enemyShip.width;
           enemy.height=enemyShip.height;
           gameObjects.push(enemy);
        }
     }
}
// Function to Create Game Life
function CreateLife(life){
    
    const lifecount=3;
    const lifeSize=10;
    const lifeSpace= 30;
    const lifeStartX= (canvas.width-canvas.width/4)+100;
    const lifeStartY= (canvas.height-canvas.height/4)+35;
  

    for (let i=0;i<lifecount;i++) {
        const x=lifeStartX+(i*(lifeSize+lifeSpace));
        const y=lifeStartY;
        const lifeObj= new Life(x,y);
        lifeObj.img=life;
        lifeObj.width=life.width;
        lifeObj.height=life.height;
        gameObjects.push(lifeObj);
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
    ctx.fillText("Score: " + score, rectX+20,rectY+rectHeight-10);
  
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
 }
 let eventEmitterObj= new EventEmitter();
    // Function to control and setup the Main game Objects
    function initializeGame(){
        gameObjects=[];
        CreatePlayer(playerImg);
        CreateEnemy(enemyShip);
        CreateLife(life);

        const moveByVal= 10;

        // Getting player instance to move
        const playerInstance=gameObjects.find(obj=>obj.type==="player");
    

        if (!playerInstance){
            console.log("Player Instance not found in Initialization");
            return;
        }

        eventEmitterObj.sub(Messages.KEY_EVENT_UP,()=>{
           if(playerInstance){
            let newY= playerInstance.y-moveByVal;
            if(newY>=0){
                playerInstance.y=newY;
            }
           playerInstance.img=playerImg;
           }
        });

        eventEmitterObj.sub(Messages.KEY_EVENT_DOWN,()=>{
            if(playerInstance){
                let newY=playerInstance.y+moveByVal;
                if(newY<=canvas.height-playerInstance.height){
                    playerInstance.y=newY;
                }
               playerInstance.img=playerImg;
            }
        });
        
        eventEmitterObj.sub(Messages.KEY_EVENT_LEFT,()=>{
            if(playerInstance){
               let newX= playerInstance.x-moveByVal;
               if(newX>=0){
                playerInstance.x=newX;
               }
               playerInstance.img=playerLeftImg;
            }
        });

        eventEmitterObj.sub(Messages.KEY_EVENT_RIGHT,()=>{
            if(playerInstance){
                let newX=playerInstance.x+moveByVal;
                if(newX<=canvas.width-playerInstance.width){
                    playerInstance.x=newX;
                }
                playerInstance.img=playerRightImg;
            }
        });
    }
    function drawGameObjects(ctx){
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
        case "ArrowDown":// Arrow Keys
        case " ": // Space Bar
            e.preventDefault();
            break;
        default:
            break;  // do not block other keys
    }
 }
// Trigger Display when game Loads
window.addEventListener("DOMContentLoaded",Display);
window.addEventListener("keydown",keysControl);
// Adding Event Listener on window
window.addEventListener("keyup",(evt)=>{


    if (evt.key==="ArrowUp"){
        eventEmitterObj.pub(Messages.KEY_EVENT_UP);
        }
    else if (evt.key==="ArrowDown"){
        eventEmitterObj.pub(Messages.KEY_EVENT_DOWN);
    }
    else if (evt.key==="ArrowRight"){
        eventEmitterObj.pub(Messages.KEY_EVENT_RIGHT);
    }
    else if ( evt.key==="ArrowLeft"){
        eventEmitterObj.pub(Messages.KEY_EVENT_LEFT);
        }
    });
