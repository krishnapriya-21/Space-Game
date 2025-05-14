/* Creating Space Game with player and enemy 

     Creating canvas and setting its context to 2d

     Drawing images using context

*/


// Declaration of Canvas and Context Variable Globally

const canvas= document.getElementById("GameCanvas");
const ctx= canvas.getContext("2d");



// Function to Display Game Canvas

async function Display(){
         

    // Creating Video Element for Background using DOM
     const video= document.createElement("video");

     const player= await AssertsImageLoad('spaceArt/player.png');
     const enemyShip= await AssertsImageLoad('spaceArt/enemyShip.png');

     video.src= "spaceArt/Background/SpaceBackGround.mp4";
     video.playsinline= true;
     video.loop=true;
     video.autoplay=true;
     video.muted=true; 
     video.style.display="none";
     document.body.appendChild(video);
     video.play();

      // Ensuring Video is played only after Loading
     video.addEventListener("loadeddata",()=>{
        Background(video,player,enemyShip);
     })

               
}

// Function to Play Video

function Background(video,player,enemyShip){
     
     ctx.drawImage(video,0,0,canvas.width,canvas.height);
     ctx.drawImage(player,canvas.width/2,canvas.height-player.height);
     ctx.drawImage(enemyShip,canvas.width/2,0);

     // For smooth  Playback
    requestAnimationFrame(()=> Background(video,player,enemyShip));

}



// Function Returning Promises to load image in canvas

function AssertsImageLoad(path){

    return new Promise((resolve)=>{

        const image= new Image();
        image.src=path;

        image.onload = () =>{

            resolve(image);

        };
        

    });
}


// Calling Display Function 

window.onload=Display;