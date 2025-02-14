
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "START";
        this.round = 1;
        this.round_data = {
            1: {
                'playerOneColor': color(248, 169, 2),
                'playerTwoColor': color(105, 113, 199),
                'playerOnePaint': color(255, 216, 130),
                'playerTwoPaint': color(152, 159, 235),
                'playerOnePosition': 14,
                'playerTwoPosition': 17,
                'pattern': [[0, 1], [1, 0], [1, 0], [0, 1], [1, 1], [0, 1], [1, 0], [1, 0], [0, 1], [0, 1], [1, 0]],
                'pattern_complete': [[0, 1], [1, 0], [1, 0], [0, 1], [1, 1], [0, 1], [1, 0], [1, 0], [0, 1], [0, 1], [1, 0], [1, 0], [0, 1], [1, 1], [0, 1], [1, 0], [1, 0], [0, 1], [0, 1], [1, 0], [1, 0]]
            },
            2: {
                'playerOneColor': color(105, 113, 199),
                'playerTwoColor': color(246, 118, 104),
                'playerOnePaint': color(152, 159, 235),
                'playerTwoPaint': color(255, 200, 194),
                'playerOnePosition': 15,
                'playerTwoPosition': 18,
                'pattern': [[1, 0], [1, 0], [0, 0], [1, 1], [0, 1], [0, 0], [1, 0], [1, 0], [1, 1], [0, 0], [0, 1], [0, 1], [1, 0]],
                'pattern_complete': [[1, 0], [1, 0], [1, 1], [1, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1], [1, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1], [1, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1]]
            },
        }
        
    }

    mix(colors) { // list of colors
        let prop = 1/colors.length;
        let red = 0;
        let green = 0;
        let blue = 0;

        for(let i = 0; i < colors.length; i++) {
            red += prop*colors[i]['levels'][0];
            green += prop*colors[i]['levels'][1];
            blue += prop*colors[i]['levels'][2];
        }

        return color(red, green, blue);
    }

    // This is called from draw() in sketch.js with every frame
    update() {

        // STATE MACHINE ////////////////////////////////////////////////
        // This is where your game logic lives
        /////////////////////////////////////////////////////////////////
        switch(this.gameState) {

            case "BLANK": 
                break;

            case "START": 
                // reset player data and update for next round
                playerOne.painted_locations = {};
                playerTwo.painted_locations = {};

                // set player + paint colors based on current round
                playerOne.position = this.round_data[this.round]['playerOnePosition'];
                playerTwo.position = this.round_data[this.round]['playerTwoPosition'];
                playerOne.playerColor = this.round_data[this.round]['playerOneColor'];
                playerTwo.playerColor = this.round_data[this.round]['playerTwoColor'];
                playerOne.paintColor = this.round_data[this.round]['playerOnePaint'];
                playerTwo.paintColor = this.round_data[this.round]['playerTwoPaint'];

                this.gameState = "PLAY";


            // main game state
            case "PLAY":
                // clear screen at frame rate so we always start fresh      
                display.clear();

                // show pattern
                let pattern_pixel = [];
                for(let i = 0; i < this.round_data[this.round]['pattern'].length; i++) {
                    pattern_pixel = [];
                    if(this.round_data[this.round]['pattern'][i][0] > 0) {
                        for(let j = 0; j < this.round_data[this.round]['pattern'][i][0]; j++) {
                            pattern_pixel.push(playerOne.paintColor);
                        }
                    }

                    if(this.round_data[this.round]['pattern'][i][1] > 0) {
                        for(let j = 0; j < this.round_data[this.round]['pattern'][i][1]; j++) {
                            pattern_pixel.push(playerTwo.paintColor);
                        }
                    }

                    display.setPixel(i, this.mix(pattern_pixel));
                }

                // show all painted pixels
                for (let i = 0; i < displaySize; i++) {
                    if(i in playerOne.painted_locations && i in playerTwo.painted_locations) {
                        display.setPixel(i, this.mix([playerOne.paintColor, playerTwo.paintColor]))
                    } else if(i in playerOne.painted_locations) {
                        display.setPixel(i, playerOne.paintColor);
                    } else if(i in playerTwo.painted_locations) {
                        display.setPixel(i, playerTwo.paintColor);
                    }
                }


                // check if pattern is complete

                // need to also add where player painted between pattern
                let canvas = structuredClone(this.round_data[this.round]['pattern']);
                let pixel = [];

                for(let i = this.round_data[this.round]['pattern'].length; i < displaySize; i++) {
                    pixel = [0, 0];
                    if(i in playerOne.painted_locations) {
                        pixel[0] = 1
                    }
                    if(i in playerTwo.painted_locations) {
                        pixel[1] = 1
                    }
                    canvas.push(structuredClone(pixel));
                }

                if(JSON.stringify(canvas) === JSON.stringify(this.round_data[this.round]['pattern_complete'])) {
                    this.gameState = "SUCCESS";
                    
                }

                // show players
                if(keyIsDown(83) && (typeof this.round_data[this.round]['pattern'][playerOne.position] === 'undefined' || JSON.stringify(this.round_data[this.round]['pattern'][playerOne.position]) === JSON.stringify([0, 0]))) {
                    display.setPixel(playerOne.position, playerOne.paintColor);
                }
                else {
                    display.setPixel(playerOne.position, playerOne.playerColor);
                }

                if(keyIsDown(DOWN_ARROW) && (typeof this.round_data[this.round]['pattern'][playerTwo.position] === 'undefined' || JSON.stringify(this.round_data[this.round]['pattern'][playerTwo.position]) === JSON.stringify([0, 0]))) {
                    display.setPixel(playerTwo.position, playerTwo.paintColor);
                }
                else {
                    display.setPixel(playerTwo.position, playerTwo.playerColor);
                }

                

                break;
 
            case "SUCCESS":       
                display.clear();

                display.setAllPixels(color(0, 255, 0));
                
                let timeout = setTimeout(() => {
                    this.round += 1;
                    this.gameState = "START";

                }, 500)

                this.gameState = "BLANK";

                // increment round, show success + progression animation

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
        // so u cant paint on the pattern
        if(!(playerOne.position in playerOne.painted_locations) && (typeof controller.round_data[controller.round]['pattern'][playerOne.position] === 'undefined' || JSON.stringify(controller.round_data[controller.round]['pattern'][playerOne.position]) === JSON.stringify([0, 0]))) {
            // paint
            playerOne.painted_locations[playerOne.position] = playerOne.position;
            // paint over other player's color 
            // if(playerOne.position in playerTwo.painted_locations) {
            //     delete playerTwo.painted_locations[playerOne.position];
            // }
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
        if(!(playerTwo.position in playerTwo.painted_locations) && (typeof controller.round_data[controller.round]['pattern'][playerTwo.position] === 'undefined' || JSON.stringify(controller.round_data[controller.round]['pattern'][playerTwo.position]) === JSON.stringify([0, 0]))) {
            // paint
            playerTwo.painted_locations[playerTwo.position] = playerTwo.position;
            // paint over other player's color 
            // if(playerTwo.position in playerOne.painted_locations) {
            //     delete playerOne.painted_locations[playerTwo.position];
            // }
        }
        else {
            // unpaint
            delete playerTwo.painted_locations[playerTwo.position];
        }
    }    
    
    // When you press the letter R, the game resets back to the play state
    if (key == 'R' || key == 'r') {
        controller.gameState = "START";
    }
  }