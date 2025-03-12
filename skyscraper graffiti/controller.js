
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {

        //this.sound = _sound;

        this.gameState = "PLAY";
        this.round = 1;

        playerOne.position = displaySize - 3;
        //playerOne.colorCycle = [color(255, 0, 0), color(255, 255, 0), color(0, 255, 0), color(0, 255, 255), color(0, 0, 255), color(255, 0, 255)];
        playerOne.colorCycle = [color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)];
        playerOne.currentColorIndex = 0;

        playerOne.color = playerOne.colorCycle[playerOne.currentColorIndex];

        this.available_floor_colors = { // picking one from each sublist?
            1: [[color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)], [color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)], [color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)]], // primary
            2: [[color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)], [color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)], [color(255,170,85), color(85,255,170), color(170,255,85)]], // primary, secondary
            3: [[color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)], [color(255,170,85), color(85,255,170), color(170,255,85)], [color(255,170,85), color(85,255,170), color(170,255,85)]], // primary, secondary
            4: [[color(255,170,85), color(85,255,170), color(170,255,85)], [color(255,170,85), color(85,255,170), color(170,255,85)], [color(255,170,85), color(85,255,170), color(170,255,85)]], // secondary
            5: [[color(255,170,85), color(85,255,170), color(170,255,85)], [color(255,170,85), color(85,255,170), color(170,255,85)], [color(255,170,85), color(85,255,170), color(170,255,85)]], // secondary
        }

        this.floor_patterns = [
            [1, 1, 2, 0, 2, 1, 1],
            [2, 1, 2, 0, 1, 0, 2],
            [0, 1, 2, 0, 1, 2, 0],
            [0, 1, 2, 1, 0, 1, 2]
        ];

        this.targetPixelPosition = playerOne.position - 3;
        if (this.round <= 5) {
            this.targetPixelColors = this.fill_pattern(this.floor_patterns[int(random(0, Object.keys(this.floor_patterns).length))], this.available_floor_colors[this.round]);
        } else {
            this.targetPixelColors = this.fill_pattern(this.floor_patterns[int(random(0, Object.keys(this.floor_patterns).length))], this.available_floor_colors[5]);
        }

        //console.log(this.targetPixelColors);
        
        this.targetPixelIndex = this.targetPixelColors.length - 1;

        display.setFloorColors(this.targetPixelColors);
        
        this.spraying = false;
        this.sprayPosition = -1;

        this.painted = false;
        this.paintColor = color(0, 0, 0);

        this.painted2 = false;
        this.paintColor2 = color(0, 0, 0);

        this.painted3 = false;
        this.paintColor3 = color(0, 0, 0);

        this.paintedCorrect = [];

        this.justMatched = false;
        this.sprayTimeout = true;

        this.prevTopFloor = color(255, 255, 255);

        this.frame_counter = 0;

        this.frames_per_chaser_move = {
            1: 20,
            2: 20,
            3: 15,
            4: 15,
            5: 10
        }

        

    }

    fill_pattern(pattern, available_colors) {

        let filled = [...pattern];
        let random_color;
        for(let i = 0; i < 3; i++) {
            random_color = available_colors[i][int(random(0, 3))];
            while(filled.find(e => typeof e === 'object' && e['levels'][0] == random_color['levels'][0] && e['levels'][1] == random_color['levels'][1] && e['levels'][2] == random_color['levels'][2]) !== undefined) {
                random_color = available_colors[i][int(random(0, 3))];
            }
            //console.log(random_color);
            for (let j = 0; j < filled.length; j++) {
                if(filled[j] == i) {
                    filled[j] = random_color;
                }
            }
        }

        console.log(`filled ${filled}`);
        return filled;
    }
    

    // generates only bright colors
    generate_random_color() {

        let random_list = [];

        for (let i = 0; i < 3; i++) {
            random_list.push(playerOne.colorCycle[int(random(0, playerOne.colorCycle.length))]);
        }

        let randomColor = this.mix(random_list);

        let red = randomColor['levels'][0];
        let green = randomColor['levels'][1];
        let blue = randomColor['levels'][2];

        while(0.2126*red + 0.7152*green + 0.0722*blue < 175) {
            random_list = [];
            for (let i = 0; i < 3; i++) {
                random_list.push(playerOne.colorCycle[int(random(0, playerOne.colorCycle.length))])
            }

            randomColor = this.mix(random_list);

            red = randomColor['levels'][0];
            green = randomColor['levels'][1];
            blue = randomColor['levels'][2];

        }

        return color(red, green, blue);
        
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

    rgb_to_lab(r0, g0, b0) {
        // i didnt write this

        var r = r0 / 255.0;
        var g = g0 / 255.0;
        var b = b0 / 255.0;
      
        r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
        g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
        b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);
      
        var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
        var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
        var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);
      
        x *= 100.0;
        y *= 100.0;
        z *= 100.0;
      
        x /= 95.047;
        y /= 100.0;
        z /= 108.883;
      
        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (4 / 29);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (4 / 29);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (4 / 29);
      
        return [(116.0 * y) - 16.0, 500.0 * (x - y), 200.0 * (y - z)];
      }

    // need to use lab -> delta e
    close_enough(color1, color2) {
        let deltaE;
        let lab1 = this.rgb_to_lab(color1["levels"][0], color1["levels"][1], color1["levels"][2]);
        let lab2 = this.rgb_to_lab(color2["levels"][0], color2["levels"][1], color2["levels"][2]);

        deltaE = Math.sqrt((lab2[0] - lab1[0])**2 + (lab2[1] - lab1[1])**2 + (lab2[2] - lab1[2])**2)

        console.log(deltaE);

        return deltaE < 20;
    }

    // This is called from draw() in sketch.js with every frame
    update() {

        // STATE MACHINE ////////////////////////////////////////////////
        // This is where your game logic lives
        /////////////////////////////////////////////////////////////////
        switch(this.gameState) {


            case "PLAY": 
                display.clear();

                if(playerOne.position != displaySize - 3) { // if not at bottom floor, start moving chaser
                    if(this.round <= 5) {
                        if (this.frame_counter < this.frames_per_chaser_move[this.round]) {
                            this.frame_counter += 1;
                        } else {
                            this.frame_counter = 0;
                            display.incrementChaser();
                        }
                    } else {
                        if (this.frame_counter < this.frames_per_chaser_move[this.round] - 2*(this.round - 5)) { // decrease frames needed by two for every round after 5
                            this.frame_counter += 1;
                        } else {
                            this.frame_counter = 0;
                            display.incrementChaser();
                        }
                    }
                    


                }

                if(display.chaser_position <= playerOne.position * 20) {
                    this.gameState = "LOSE";
                }
                
                

                //console.log(`${this.painted}, ${this.painted2}`);

                //playerOne.color.setAlpha(255);

                if(keyIsDown(83)) {

                    if(!this.spraying && !this.justMatched && this.sprayTimeout) {
                        this.spraying = true;
                        this.sprayPosition = playerOne.position;
                        //playerOne.color.setAlpha(128);
                    }
                    // need a delay after so players have control over how much is sprayed
                    // + delay after successfully matched color

                    
                }

                // draw player
                display.setPixel(playerOne.position, playerOne.colorCycle[playerOne.currentColorIndex]);
                display.setBorderedPixel(playerOne.position, color(0, 0, 0), 2);
                
                // draw target pixel
                display.setBorderedPixel(this.targetPixelPosition, this.targetPixelColors[this.targetPixelIndex], 10);

                // spray animation
                if(this.spraying) {
                    this.sprayPosition -= 1;

                    
                    if(this.sprayPosition == this.targetPixelPosition && this.painted == false) {
                        // target pixel empty
                        this.painted = true;
                        this.paintColor = playerOne.colorCycle[playerOne.currentColorIndex];
                        this.spraying = false;
                        this.sprayTimeout = false;
                        setTimeout(() => {
                            this.sprayTimeout = true;
                        }, "250");
                    } else if(this.sprayPosition == this.targetPixelPosition && this.painted == true) {
                        // target pixel not empty
                        this.paintColor = this.mix([this.paintColor, playerOne.colorCycle[playerOne.currentColorIndex]]);
                        this.spraying = false;
                        this.sprayTimeout = false;
                        setTimeout(() => {
                            this.sprayTimeout = true;
                        }, "250");
                    }

                    // for the target pixel closer to the player
                    if(this.sprayPosition == this.targetPixelPosition + 1 && this.painted2 == false) {
                        // empty
                        this.painted2 = true;
                        this.paintColor2 = playerOne.colorCycle[playerOne.currentColorIndex];
                    } else if(this.sprayPosition == this.targetPixelPosition + 1 && this.painted2 == true) {
                        // not empty
                        this.paintColor2 = this.mix([this.paintColor2, playerOne.colorCycle[playerOne.currentColorIndex]]);
                    }

                    // for the target pixel closer to the player
                    if(this.sprayPosition == this.targetPixelPosition + 2 && this.painted3 == false) {
                        // empty
                        this.painted3 = true;
                        this.paintColor3 = playerOne.colorCycle[playerOne.currentColorIndex];
                    } else if(this.sprayPosition == this.targetPixelPosition + 2 && this.painted3 == true) {
                        // not empty
                        this.paintColor3 = this.mix([this.paintColor3, playerOne.colorCycle[playerOne.currentColorIndex]]);
                    }



                    display.setPixel(this.sprayPosition, playerOne.colorCycle[playerOne.currentColorIndex]);
                }

                if(this.painted2) {
                    display.setPixel(this.targetPixelPosition + 1, this.paintColor2, true);
                }

                if(this.painted3) {
                    display.setPixel(this.targetPixelPosition + 2, this.paintColor3, true);
                }

                // color mixing on the target pixel
                if(this.painted && this.painted2 && this.painted3) {
                    display.setPixel(this.targetPixelPosition, this.paintColor, true);

                    if(this.close_enough(this.paintColor, this.targetPixelColors[this.targetPixelIndex])) {
                        display.clear();

                        this.justMatched = true;

                        this.painted = false;
                        this.painted2 = false;
                        this.painted3 = false;

                        this.paintedCorrect.push([color(this.paintColor['levels'][0], this.paintColor['levels'][1], this.paintColor['levels'][2]), color(this.targetPixelColors[this.targetPixelIndex]['levels'][0], this.targetPixelColors[this.targetPixelIndex]['levels'][1], this.targetPixelColors[this.targetPixelIndex]['levels'][2])]);

                        if(this.targetPixelIndex >= 0) {
                            this.targetPixelIndex -= 1;
                        }
                        
                        this.paintColor = color(0, 0, 0);

                        this.sprayPosition = -1;

                        playerOne.position -= 4;
                        this.targetPixelPosition -= 4;

                        if(playerOne.position < 2) {
                            this.round += 1;
                            this.prevTopFloor = this.targetPixelColors[0];
                            this.sprayTimeout = false;
                            reset();
                        }
                        

                    }
                }

                // displaying target pixels that they painted correctly
                for(let i = 0; i < this.paintedCorrect.length; i++) {
                    //display.setPixel(displaySize - (3*(i+1) + 2), this.paintedCorrect[i][0]);
                    //display.setBorderedPixel(displaySize - (3*(i+1) + 2), this.paintedCorrect[i][1]);

                    display.setPixel(displaySize - (4*(i+1) + 0), this.paintedCorrect[i][1], true);
                    display.setPixel(displaySize - (4*(i+1) + 1), this.paintedCorrect[i][1], true);
                    display.setPixel(displaySize - (4*(i+1) + 2), this.paintedCorrect[i][1], true);
                }

                // displaying target pixel from top of prev level
                display.setPixel(displaySize - 0, this.prevTopFloor, true);
                display.setPixel(displaySize - 1, this.prevTopFloor, true);
                display.setPixel(displaySize - 2, this.prevTopFloor, true);
                
                break;
 
            case "WIN":       
                break;

            case "LOSE":
                display.clear();
                break;

            // Not used, it's here just for code compliance
            default:
                break;
        }
    }
}

function reset() {
    playerOne.position = displaySize - 3;
    //playerOne.colorCycle = [color(255, 0, 0), color(255, 255, 0), color(0, 255, 0), color(0, 255, 255), color(0, 0, 255), color(255, 0, 255)];
    //playerOne.colorCycle = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];
    playerOne.colorCycle = [color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)];
    playerOne.currentColorIndex = 0;

    playerOne.color = playerOne.colorCycle[playerOne.currentColorIndex];

    controller.targetPixelPosition = playerOne.position - 3;
    controller.targetPixelColors = [];
    if (controller.round <= 5) {
        controller.targetPixelColors = controller.fill_pattern(controller.floor_patterns[int(random(0, Object.keys(controller.floor_patterns).length))], controller.available_floor_colors[controller.round]);
    } else {
        controller.targetPixelColors = controller.fill_pattern(controller.floor_patterns[int(random(0, Object.keys(controller.floor_patterns).length))], controller.available_floor_colors[5]);
    }

    controller.targetPixelIndex = controller.targetPixelColors.length - 1;

    display.setFloorColors(controller.targetPixelColors);
    
    controller.spraying = false;
    controller.sprayPosition = -1;

    controller.painted = false;
    controller.paintColor = color(0, 0, 0);

    controller.painted2 = false;
    controller.paintColor2 = color(0, 0, 0);

    controller.painted3 = false;
    controller.paintColor3 = color(0, 0, 0);

    controller.paintedCorrect = [];

    controller.justMatched = false;
    controller.sprayTimeout = true;

    controller.frame_counter = 0;
    display.resetChaser();

    controller.gameState = "PLAY";
}


function keyReleased() {
    if(key == 's' || key == 'S') {
        //playerOne.color.setAlpha(255);
    }
}

function keyPressed() {
    // if(key == 'S' || key == 's') {
    //     if(!controller.spraying) {
    //         controller.spraying = true;
    //         controller.sprayPosition = playerOne.position;
    //     }
    // }

    if(key == 'S' || key == 's') {
        controller.justMatched = false;
        //controller.sound.play();
    }

    if((key == 'D' || key == 'd') && !controller.spraying) {
        if(playerOne.currentColorIndex < playerOne.colorCycle.length - 1) {
            playerOne.currentColorIndex += 1;
        } else {
            playerOne.currentColorIndex = 0;
        }
    }

    // if(key == 'A' || key == 'a') {
    //     if(playerOne.currentColorIndex > 0) {
    //         playerOne.currentColorIndex -= 1;
    //     } else {
    //         playerOne.currentColorIndex = playerOne.colorCycle.length - 1;
    //     }
    // }

    if(key == 'R' || key == 'r') {
        // temp
        controller.round = 1;
        controller.prevTopFloor = color(255, 255, 255);
        reset();
        
    }
}


// to add:
// erase button
// player climbing animation, cleaner climbing animation
// floor colors that continue from the last round
// building -> clouds -> dark sky -> space in bg as u keep climbing

// block color switching when spraying