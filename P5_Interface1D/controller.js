
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "PLAY";
       
    }
    
    // This is called from draw() in sketch.js with every frame
    update() {

        // STATE MACHINE ////////////////////////////////////////////////
        // This is where your game logic lives
        /////////////////////////////////////////////////////////////////
        switch(this.gameState) {

            // This is the main game state, where the playing actually happens
            case "PLAY":

                // clear screen at frame rate so we always start fresh      
                display.clear();

                // set all painted pixels
                for (const [location, value] of Object.entries(playerOne.painted_locations)) {
                    display.setPixel(location, playerOne.playerTrueColor);
                }
                for (const [location, value] of Object.entries(playerTwo.painted_locations)) {
                    display.setPixel(location, playerTwo.playerTrueColor);
                }
            
                // show all players in the right place, by adding them to display buffer
                if(keyIsDown(83)) {
                    display.setPixel(playerOne.position, playerOne.playerTrueColor);
                }
                else {
                    display.setPixel(playerOne.position, playerOne.playerColor);
                }

                if(keyIsDown(DOWN_ARROW)) {
                    display.setPixel(playerTwo.position, playerTwo.playerTrueColor);
                }
                else {
                    display.setPixel(playerTwo.position, playerTwo.playerColor);
                }
                break;
 
            case "END":       
                display.setAllPixels(playerTwo.playerColor); 
                break;

            // Not used, it's here just for code compliance
            default:
                break;
        }
    }
}




// This function gets called when a key on the keyboard is pressed
function keyPressed() {

    // Move player one to the left if letter A is pressed
    if (key == 'A' || key == 'a') {
        playerOne.move(-1);
      }
    
    // And so on...
    if (key == 'D' || key == 'd') {
        playerOne.move(1);
    }    

    if (key == 'S' || key == 's') {
        // might change back to array + move toggle logic to controller.js
        if(!(playerOne.position in playerOne.painted_locations)) {
            // paint
            playerOne.painted_locations[playerOne.position] = playerOne.position;
            // paint over other player's color 
            if(playerOne.position in playerTwo.painted_locations) {
                delete playerTwo.painted_locations[playerOne.position];
            }
        }
        else {
            // unpaint
            delete playerOne.painted_locations[playerOne.position];
        }
    }    

    if (keyCode === LEFT_ARROW) {
        playerTwo.move(-1);
    }
    
    if (keyCode === RIGHT_ARROW) {
        playerTwo.move(1);
    }

    if (keyCode === DOWN_ARROW) {
        // might change back to array + move toggle logic to controller.js
        if(!(playerTwo.position in playerTwo.painted_locations)) {
            // paint
            playerTwo.painted_locations[playerTwo.position] = playerTwo.position;
            // paint over other player's color 
            if(playerTwo.position in playerOne.painted_locations) {
                delete playerOne.painted_locations[playerTwo.position];
            }
        }
        else {
            // unpaint
            delete playerTwo.painted_locations[playerTwo.position];
        }
    }    
    
    // When you press the letter R, the game resets back to the play state
    if (key == 'R' || key == 'r') {
    controller.gameState = "PLAY";
    }
  }