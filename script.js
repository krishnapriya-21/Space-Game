/* Space-Game
* Welcome Panel
* BackGround Audio, Sound Icon, Video
* Game Player and Enemy 
* Score Count
* Lives Count
*/


// Declaring Canvas and setting Context to 2d to draw images
const canvas= document.getElementById("GameCanvas");
const ctx= canvas.getContext("2d");

// Game control Variables
let gameStarted= false;
let video;
// Sound Icon as image Initialization
const soundButton= new Image();
let videoReady= false; // Flag for video loading
let player,enemyShip,life; // Game Assets
let score=0; 


// Function to Control Game Canvas Display 
async function Display(){
         
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    // Loading assets in parallel before starting the game loop
    await  backgroundVideo();

    // Draw Video
    drawVideoFrame();

    // Loading Game Assets
    player= await AssetsImageLoad('spaceArt/player.png');
    enemyShip= await AssetsImageLoad('spaceArt/enemyShip.png');
    life=await AssetsImageLoad('spaceArt/life.png');
   
    // Background Sound and Icon 
     await backgroundAudio();
     drawSoundIcon();
    StartGameFrame();
    gameloop(); // Begin Main game Loop
                   
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
    }

    // Draw game assets only after game starts
    if (gameStarted){
        drawFramePlayer(player);
        drawFrameEnemy(enemyShip);
        drawFrameLife(life);
        drawScore();
    }

    requestAnimationFrame(gameloop);

}



// Function to Control Initial Game Screen
 async function StartGameFrame(){


   // Calling Start Screen Text Element
   const startScreen= document.getElementById("startScreen");

   startScreen.addEventListener("click",()=>
   {
        startScreen.style.display="none";
        gameStarted=true;
   });
             
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
            requestAnimationFrame(drawVideoFrame);
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
        requestAnimationFrame(drawSoundIcon);
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


// Function to control and Draw Enemy 
function drawFrameEnemy(enemyShip){
      
    const monsterCount=5;
    const monsterWidth= monsterCount*98;
    const monsterStart_X= (canvas.width-monsterWidth)/2;
    const monsterStop_X= monsterStart_X+monsterWidth;
      
 
     // Drawing 5*5 EnemyShips
     for (let x =monsterStart_X; x <monsterStop_X; x+=98){
        for (let y=0; y<50*5; y+=50){
            ctx.drawImage(enemyShip,x,y);
        }
     }
}

// Function to control and draw Player
function drawFramePlayer(player){

    ctx.drawImage(player,(canvas.width-player.width)/2,(canvas.height-canvas.height/4));

}

// Function to control and Draw Life
function drawFrameLife(life){
    
    const lifecount=3;
    const lifeSize=10;
    const lifeSpace= 30;
    const lifeStartX= (canvas.width-canvas.width/4)+100;
    const lifeStartY= (canvas.height-canvas.height/4)+35;
  

    for (let i=0;i<lifecount;i++) {
        ctx.drawImage(life,lifeStartX+(i*(lifeSize+lifeSpace)),lifeStartY);
    }
}

// Function to Control and Display Score
function drawScore(){    

     
    const scoreStartX= (canvas.width-canvas.width/2)-550;
    const scoreStartY= (canvas.height-canvas.height/4)+ 60;

    ctx.fillStyle="rgba(0,0,0,0.5)";
    ctx.fillRect(10,10,150,40);
    ctx.fillStyle="white";
    ctx.font=" bold 30px Arial"; 
    ctx.fillText("Score: " + score, scoreStartX,scoreStartY);
  
}

// Trigger Display when game Loads
window.addEventListener("DOMContentLoaded",Display);

