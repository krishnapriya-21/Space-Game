/* Space-Game
* Welcome Panel
* Game Player and Enemy Panel
*/



// Declaring Canvas and setting Context to 2d to draw images

const canvas= document.getElementById("GameCanvas");
const ctx= canvas.getContext("2d");

// To control Game start
let gameStarted= false;



// Function to Display Game Canvas

async function Display(){
         

    //Clearing Canvas before Display

    ctx.clearRect(0,0,canvas.width,canvas.height);
 
   
    // Calling Start Game

    StartGameFrame();


    // Drawing player and enemyship upon game start

    const player= await AssetsImageLoad('spaceArt/player.png');
    const enemyShip= await AssetsImageLoad('spaceArt/enemyShip.png');

    if (gameStarted) {

        DrawFrameGameAssets(player,enemyShip);

    }
    
                  
}


/* Function for Initial Game Screen
* Background Video Initialize
* Background Audio Image Initialize
* Background Audio Play Initialize
* Game Start Text Initialize
*/


 async function StartGameFrame(){


    // Calling Background Video Element

    await backgroundVideo().then(()=>{
        console.log("Background video started successfully");
    }).catch(err=>{
        console.log("video playbackissue", err);
    });

     
    // Calling Background audio Element

    await backgroundAudio().then(()=>{
        console.log("Background audio started successfully");
    }).catch(err=>{
        console.log("Audio playback issue",err);
    });


    // Calling Start Screen Text Element
   const startScreen= document.getElementById("startScreen");

   startScreen.addEventListener("click",()=>
   {
    startScreen.style.display="none";
    gameStarted=true;
   });
             
 }


 // Function for Game Canvas Background Video
async function backgroundVideo(){


    return new Promise((resolve)=>{


     // Creating Video Element for Background using DOM
     const video= document.createElement("video");

     video.src= "spaceArt/Background/starry-background.mp4";
     video.playsinline= true;
     video.loop=true;
     video.muted=true; 
    
     //document.body.appendChild(video); // Video Element is in DOM

     video.play();
     video.addEventListener("canplaythrough",()=>{

        function drawFrame(){
            ctx.drawImage(video,0,0,canvas.width,canvas.height);
           // drawSoundIcon(); // Redrawing Sound Icon Repeatedly after video Element 
            requestAnimationFrame(drawFrame);
         }
         drawFrame();
         resolve(); 
     });

    });
}


//Function for Game Canvas Background Audio with Sound Icon
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

     // Sound Icon as image Initialization
     const soundButton= new Image();
     soundButton.src="spaceArt/Background/muteIcon.png";
     soundButton.style.border="red solid 10px";


     
     // Icon Position
     const iconX=canvas.width-50;
     const iconY=20;
     const iconSize=30;
     
     
    function drawSoundIcon(){
        ctx.drawImage(soundButton,iconX,iconY,iconSize,iconSize);
    }
   

     //  Adding Sound Icon initially once image loads   

     soundButton.onload=()=>{

        ctx.drawImage(soundButton,iconX,iconY,iconSize,iconSize);
        resolve(); // Resolving after sound Image is Loaded
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

            ctx.clearRect(iconX,iconY,iconSize,iconSize); // Clears Previous Icon

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


// Function for Player and EnemyShip Display

function DrawFrameGameAssets(player,enemyShip){
      

    const monsterCount=5;
    const monsterWidth= monsterCount*98;
    const monsterStart_X= (canvas.width-monsterWidth)/2;
    const monsterStop_X= monsterStart_X+monsterWidth;
    
    ctx.drawImage(player,(canvas.width-player.width)/2,(canvas.height-canvas.height/4));
    

     // Drawing 5*5 EnemyShips

     for (let x =monsterStart_X; x <monsterStop_X; x+=98){
        for (let y=0; y<50*4; y+=50){
            ctx.drawImage(enemyShip,x,y);
        }

     }

     
}


// Trigger Display function when the game starts

window.addEventListener("DOMContentLoaded",Display);