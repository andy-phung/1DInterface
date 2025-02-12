
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "BLANK";

        this.blank_time = 750;

        this.setTimings();

        this.wave = [];
        this.wave_in_progress = false;
        this.wave_count = -1; // help
        this.wave_visible = "no"; // "no", "flash", "yes"

    }

    setTimings() {

        let blank_timeout;
        
        this.blank_timeout = setTimeout(() => {
            this.gameState = "PLAY";
        }, this.blank_time);

    }

    waveToTime(wave_count) {
        if(wave_count < 3) {
            return 3000;
        } else if (wave_count < 6) {
            return 2000;
        } else {
            return 1000;
        }
    }

    setWaveTimeouts(interval, hold) {
        let flash1;
        let clear1
        let flash2;
        let clear2;
        let flash3;
        let clear3;
        let appear;
        let appear_clear;

        flash1 = setTimeout(() => {
            this.wave_visible = "flash";
        }, interval / 7);
        clear1 = setTimeout(() => {
            this.wave_visible = "no";
        }, (interval / 7) * 2);
        flash2 = setTimeout(() => {
            this.wave_visible = "flash";
        }, (interval / 7) * 3);
        clear2 = setTimeout(() => {
            this.wave_visible = "no";
        }, (interval / 7) * 4);
        flash3 = setTimeout(() => {
            this.wave_visible = "flash";
        }, (interval / 7) * 5);
        clear3 = setTimeout(() => {
            this.wave_visible = "no";
        }, (interval / 7) * 6);
        appear = setTimeout(() => {
            this.wave_visible = "yes";
        }, (interval / 7) * 7);

        appear_clear = setTimeout(() => {
            this.wave_visible = "no";
            this.wave_in_progress = false;
            // collision logic goes here
            //if


        }, interval + hold)

        // set this.wave_in_progress to false at end of inside last function
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

                playerOne.position = parseInt(random(0,displaySize));
                playerTwo.position = parseInt(random(0,displaySize));

                break;


            // main game state
            case "PLAY":

                display.clear();

                

                // map waves to time before lava appears, divide to get three flashes

                if(!this.wave_in_progress) {
                    // generate wave
                    this.wave = [];
                    let pixels = 0;
                    let random_number;

                    while (pixels < 7) {
                        this.wave = [];
                        pixels = 0;
                        // regen until we get at least 7 pixels
                        for (let i = 0; i < displaySize; i++) {
                            random_number = Math.round(Math.random());
                            if(random_number == 1) {
                                this.wave[i] = random_number;
                                pixels += 1;
                            }
                        }
                    }

                    this.wave_in_progress = true;
                    this.wave_count += 1;
                    // set timeouts for flashes + wave appear
                    this.setWaveTimeouts(this.waveToTime(this.wave_count), 1500);
                    

                }

                if(this.wave_visible == "flash") {
                    for (let i = 0; i < displaySize; i++) {
                        if(this.wave[i] == 1) {
                            display.setPixel(i, color(255, 150, 100));
                        }
                    }
                } else if(this.wave_visible == "yes") {
                    for (let i = 0; i < displaySize; i++) {
                        if(this.wave[i] == 1) {
                            display.setPixel(i, color(255, 85, 0));
                        }
                    }

                    

                }

                display.setPixel(playerOne.position, playerOne.playerColor);
                display.setPixel(playerTwo.position, playerTwo.playerColor);

                break;
 
            case "SCORE":     
                display.clear();

                let prev_score = [];
                //for(let i = 0; i < playerOne.score)

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
    if ((key == 'A' || key == 'a') && controller.wave_visible != "yes") {
        playerOne.move(-1);
      }
    
    // And so on...
    if ((key == 'D' || key == 'd') && controller.wave_visible != "yes") {
        playerOne.move(1);
    }    

    if (keyCode === LEFT_ARROW && controller.wave_visible != "yes") {
        playerTwo.move(-1);
    }
    
    if (keyCode === RIGHT_ARROW && controller.wave_visible != "yes") {
        playerTwo.move(1);
    }
    
    // When you press the letter R, the game resets back to the play state
    if (key == 'R' || key == 'r') {
        controller.gameState = "BLANK";
        controller.setTimings();
    }
  }