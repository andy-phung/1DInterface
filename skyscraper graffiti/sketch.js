/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  February 9, 2024
  Marcelo Coelho

*/ /////////////////////////////////////


let displaySize = 32;   // how many pixels are visible in the game
let pixelSize = 20;     // how big each 'pixel' looks on screen

let playerOne;    // Adding 2 players to the game
let playerTwo;
let target;       // and one target for players to catch.

let display;      // Aggregates our final visual output before showing it on the screen

let controller;   // This is where the state machine and game logic lives

let collisionAnimation;   // Where we store and manage the collision animation

let score;        // Where we keep track of score and winner



function setup() {

  let canvasWidth = pixelSize*51; // needs to be an odd number
  let canvasHeight = (displaySize*pixelSize);

  createCanvas(canvasWidth, canvasHeight);    // dynamically sets canvas size

  display = new Display(displaySize, pixelSize, canvasWidth);        //Initializing the display

  playerOne = new Player(displaySize);   // Initializing players
  playerTwo = new Player(displaySize);

  controller = new Controller();            // Initializing controller

  frameRate(15);

}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function draw() {

  // start with a blank screen
  background(0, 0, 0);    

  // Runs state machine at determined framerate
  controller.update();

  // After we've updated our states, we show the current one 
  display.show();


}


