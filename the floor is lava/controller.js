
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "BLANK";

        this.blank_time = 750;

        this.setTimings();

        this.wave = Array(displaySize).fill(0);
        this.wave_in_progress = false;
        this.wave_count = -1; // help
        this.wave_visible = "no"; // "no", "flash", "yes"

        this.prev_score = [];
        this.new_score = [];

    }

    setTimings() {

        let blank_timeout;
        
        this.blank_timeout = setTimeout(() => {
            this.gameState = "PLAY";
        }, this.blank_time);

    }

    waveToTime(wave_count) {
        if(wave_count < 1) {
            return 2500;
        } else if (wave_count < 2) {
            return 1750;
        } else if (wave_count < 3) {
            return 1250;
        } else if (wave_count < 5) {
            return 1000;
        } else {
            return 800;
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
            if(this.wave[playerOne.position] == 1 || this.wave[playerTwo.position] == 1) {
                this.gameState = "SCORE"
            }
            //this.wave_count = 0;
            // ^makes it less fun imo


        }, interval + hold)

        // set this.wave_in_progress to false at end of inside last function
    }

    setScoreTimeouts() {
        let prevScore;
        let newScore;
        let end;

        prevScore = setTimeout(() => {
            display.clear();
            for(let i = 0; i < this.prev_score.length; i++) {
                if(this.prev_score[i] == 1) {
                    display.setPixel(i, playerOne.playerColor);
                } else if(this.prev_score[i] == 2) {
                    display.setPixel(i, playerTwo.playerColor);
                }
            }
        }, 250);

        newScore = setTimeout(() => {
            display.clear();
            for(let i = 0; i < this.new_score.length; i++) {
                if(this.new_score[i] == 1) {
                    display.setPixel(i, playerOne.playerColor);
                } else if(this.new_score[i] == 2) {
                    display.setPixel(i, playerTwo.playerColor);
                }
            }
        }, 250+500);

        end = setTimeout(() => {
            if(playerOne.score > 6 || playerTwo.score > 6) {
                this.gameState = "END";
            } else {
                this.gameState = "PLAY";
            }
            
        }, 250+500+1500);
    }
    
    // This is called from draw() in sketch.js with every frame
    update() {

        // STATE MACHINE ////////////////////////////////////////////////
        // This is where your game logic lives
        /////////////////////////////////////////////////////////////////
        switch(this.gameState) {

            case "BLANK":
                // clear screen
                display.clear();

                playerOne.position = parseInt(random(0,displaySize));
                playerTwo.position = parseInt(random(0,displaySize));

                break;

            case "BLANK2":
                break;


            // main game state
            case "PLAY":

                display.clear();

                

                // map waves to time before lava appears, divide to get three flashes

                if(!this.wave_in_progress) {
                    // generate wave
                    this.wave = Array(displaySize).fill(0);
                    let pixels = 0;
                    let random_number;

                    while (pixels < Math.round(0.75 * displaySize)) { // 3/4 of the screen
                        // regen until we get at least that many lava pixels
                        for (let i = 0; i < displaySize; i++) {
                            random_number = Math.round(Math.random());      
                            if(random_number == 1) {
                                pixels += 1;
                                this.wave[i] = random_number;
                                if(pixels == Math.round(0.75 * displaySize)) {
                                    break;
                                }
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

                if(this.wave[playerOne.position] == 1 && this.wave_visible == "flash") {
                    display.setPixel(playerOne.position, color(216,191,216));
                } else {
                    display.setPixel(playerOne.position, playerOne.playerColor);
                }

                if(this.wave[playerTwo.position] == 1 && this.wave_visible == "flash") {
                    display.setPixel(playerTwo.position, color(125, 125, 252));
                } else {
                    display.setPixel(playerTwo.position, playerTwo.playerColor);
                }
                
                

                break;
 
            case "SCORE":     
                display.clear();

                this.prev_score = [];
                for(let i = 0; i < playerOne.score; i++) {
                    this.prev_score[i] = 1
                }
                for(let i = displaySize-1; i >= displaySize - playerTwo.score; i--) {
                    this.prev_score[i] = 2
                }

                

                if(this.wave[playerOne.position] == 1 && this.wave[playerTwo.position] == 0) {
                    playerTwo.score += 1;
                } else if(this.wave[playerOne.position] == 0 && this.wave[playerTwo.position] == 1) {
                    playerOne.score += 1;
                }

                this.new_score = [];
                for(let i = 0; i < playerOne.score; i++) {
                    this.new_score[i] = 1
                }
                for(let i = displaySize-1; i >= displaySize - playerTwo.score; i--) {
                    this.new_score[i] = 2
                }

                this.setScoreTimeouts();

                this.gameState = "BLANK2";

                // go to end if reached threshold score
                

                break;

            case "END":
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