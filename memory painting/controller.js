
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "BLANK";

        this.blank_time = 100;
        this.mural_time = 100;
        this.play_time = 1000000;

        this.setTimings();

        this.mural = [];

        this.colors = {
            0: color(0, 0, 0),
            1: playerOne.playerPaintColor,
            2: playerTwo.playerPaintColor,
            3: color(255, 0, 0), // color for wrong
            4: color(0, 255, 0) // color for right
        };

        // generate mural
        let pixels = 0;
        let random_number;

        while (pixels < 7) {
            this.mural = [];
            pixels = 0;
            // regen until we get 10 pixels
            for (let i = 0; i < displaySize; i++) {
                random_number = this.randomMapWeighted(random(0, 1));
                if (random_number == 1 || random_number == 2) {
                    pixels += 1;
                }
                this.mural[i] = random_number;
                
            }
        }

        this.mural = [];
        // regen until we get 10 pixels
        for (let i = 0; i < displaySize; i++) {
            random_number = this.randomMapWeighted(random(0, 1));
            this.mural[i] = random_number; 
        }

        for (let i = 0; i < 5; i++) {
            this.mural[i] = 0; 
        }

        for (let i = displaySize-1; i > 9; i--) {
            this.mural[i] = 0; 
        }
        


        
    }

    randomMapWeighted(random_number) {
        if(random_number < 0) {
            return 0;
        }
        else if(random_number < 0.5) {
            return 1;
        }
        else {
            return 2;
        }
    }

    setTimings() {

        let blank_timeout;
        let mural_timeout; 
        let play_timeout;
        
        this.blank_timeout = setTimeout(() => {
            this.gameState = "MURAL";
        }, this.blank_time);

        this.mural_timeout = setTimeout(() => {
            this.gameState = "PLAY";
        }, this.blank_time + this.mural_time);

        this.play_timeout = setTimeout(() => {
            this.gameState = "END";
        }, this.blank_time + this.mural_time + this.play_time);
    }
    
    // This is called from draw() in sketch.js with every frame
    update() {

        // STATE MACHINE ////////////////////////////////////////////////
        // This is where your game logic lives
        /////////////////////////////////////////////////////////////////
        switch(this.gameState) {

            case "BLANK":
                // clear screen and all player data
                display.clear();

                playerOne.painted_locations = {};
                playerTwo.painted_locations = {};

                playerOne.position = 5;
                playerTwo.position = 9;

                // generate mural
                let pixels = 0;
                let random_number;

                while (pixels < 7) {
                    this.mural = [];
                    pixels = 0;
                    // regen until we get 10 pixels
                    for (let i = 0; i < displaySize; i++) {
                        random_number = this.randomMapWeighted(random(0, 1));
                        if (random_number == 1 || random_number == 2) {
                            pixels += 1;
                        }
                        this.mural[i] = random_number;
                        
                    }
                }

                this.mural = [];
                // regen until we get 10 pixels
                for (let i = 0; i < displaySize; i++) {
                    random_number = this.randomMapWeighted(random(0, 1));
                    this.mural[i] = random_number; 
                }

                for (let i = 0; i < 5; i++) {
                    this.mural[i] = 0; 
                }

                for (let i = displaySize-1; i > 9; i--) {
                    this.mural[i] = 0; 
                }

                break;

            case "MURAL":
                for (let i = 0; i < this.mural.length; i++) {
                    display.setPixel(i, this.colors[this.mural[i]]);
                }
                break;

            // main game state
            case "PLAY":
                // clear screen at frame rate so we always start fresh      
                display.clear();

                // set all painted pixels
                for (const [location, value] of Object.entries(playerOne.painted_locations)) {
                    display.setPixel(location, playerOne.playerPaintColor);
                }
                for (const [location, value] of Object.entries(playerTwo.painted_locations)) {
                    display.setPixel(location, playerTwo.playerPaintColor);
                }
            
                // show all players in the right place, by adding them to display buffer
                if(keyIsDown(83)) {
                    display.setPixel(playerOne.position, playerOne.playerPaintColor);
                }
                else {
                    display.setPixel(playerOne.position, playerOne.playerColor);
                }

                if(keyIsDown(DOWN_ARROW)) {
                    display.setPixel(playerTwo.position, playerTwo.playerPaintColor);
                }
                else {
                    display.setPixel(playerTwo.position, playerTwo.playerColor);
                }
                break;
 
            case "END":       
                let result_array = new Array(displaySize).fill(color(0, 0, 0));
                let final_paints = new Array(displaySize).fill(0); 

                for (const [location, value] of Object.entries(playerOne.painted_locations)) {
                    final_paints[location] = 1;
                }

                for (const [location, value] of Object.entries(playerTwo.painted_locations)) {
                    final_paints[location] = 2;
                }

                // check if equal to this.mural; if not, create result_array in order and find diff

                let all_match = true;

                for (let i = 0; i < this.mural.length; i++) {
                    if(final_paints[i] != this.mural[i]) {
                        result_array[i] = 3;
                        all_match = false;
                    }
                    else {
                        result_array[i] = final_paints[i];
                    }
                }

                if (all_match) {
                    for (let i = 0; i < result_array.length; i++) {
                        if(result_array[i] == 0) {
                            result_array[i] = 4;
                        }
                    }
                }

                for (let i = 0; i < result_array.length; i++) {
                    display.setPixel(i, this.colors[result_array[i]]);
                }

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
        controller.gameState = "BLANK";
        controller.setTimings();
    }
  }