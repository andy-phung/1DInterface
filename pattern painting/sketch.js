/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  February 9, 2024
  Marcelo Coelho

*/ /////////////////////////////////////


let displaySize = 21;   // how many pixels are visible in the game
let pixelSize = 20;     // how big each 'pixel' looks on screen

let playerOne;    // Adding 2 players to the game
let playerTwo;
let target;       // and one target for players to catch.

let display;      // Aggregates our final visual output before showing it on the screen
let display2;

let controller;   // This is where the state machine and game logic lives

let collisionAnimation;   // Where we store and manage the collision animation

let score;        // Where we keep track of score and winner



function setup() {

  createCanvas((displaySize*pixelSize), pixelSize*3);     // dynamically sets canvas size

  display = new Display(displaySize, pixelSize, false);        //Initializing the display
  display2 = new Display(displaySize, pixelSize, true);

  playerOne = new Player(displaySize);   // Initializing players
  playerTwo = new Player(displaySize);

  controller = new Controller();            // Initializing controller

}

function draw() {

  // start with a blank screen
  background(0, 0, 0);    

  // Runs state machine at determined framerate
  controller.update();

  // After we've updated our states, we show the current one 
  display.show();
  display2.show();


}


