
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "PLAY";
        this.round = 1;

        playerOne.position = displaySize - 3;
        //playerOne.colorCycle = [color(255, 0, 0), color(255, 255, 0), color(0, 255, 0), color(0, 255, 255), color(0, 0, 255), color(255, 0, 255)];
        playerOne.colorCycle = [color(0, 255, 255), color(255, 0, 255), color(255, 255, 0)];
        playerOne.currentColorIndex = 0;

        this.targetPixelPosition = playerOne.position - 2;
        this.targetPixelColors = [];
        for(let i = 0; i < 8; i++) {
            this.targetPixelColors.push(this.generate_random_color())
        }
        this.targetPixelIndex = this.targetPixelColors.length - 1;

        display.setFloorColors(this.targetPixelColors);
        
        this.spraying = false;
        this.sprayPosition = -1;

        this.painted = false;
        this.paintColor = color(0, 0, 0);

        this.painted2 = false;
        this.paintColor2 = color(0, 0, 0);

        this.paintedCorrect = [];

        this.justMatched = false;
        this.sprayTimeout = true;

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

                //console.log(`${this.painted}, ${this.painted2}`);

                if(keyIsDown(83)) {
                    if(!this.spraying && !this.justMatched && this.sprayTimeout) {
                        this.spraying = true;
                        this.sprayPosition = playerOne.position;
                    }
                    // need a delay after so players have control over how much is sprayed
                    // + delay after successfully matched color
                }

                // draw player
                display.setPixel(playerOne.position, playerOne.colorCycle[playerOne.currentColorIndex]);
                // draw target pixel
                display.setBorderedPixel(this.targetPixelPosition, this.targetPixelColors[this.targetPixelIndex]);
                display.setBorderedPixel(this.targetPixelPosition + 1, this.targetPixelColors[this.targetPixelIndex]);

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



                    display.setPixel(this.sprayPosition, playerOne.colorCycle[playerOne.currentColorIndex]);
                }

                if(this.painted2) {
                    display.setPixel(this.targetPixelPosition + 1, this.paintColor2);
                }

                // color mixing on the target pixel
                if(this.painted) {
                    display.setPixel(this.targetPixelPosition, this.paintColor);

                    if(this.close_enough(this.paintColor, this.targetPixelColors[this.targetPixelIndex])) {
                        display.clear();

                        this.justMatched = true;

                        this.painted = false;
                        this.painted2 = false;

                        this.paintedCorrect.push([color(this.paintColor['levels'][0], this.paintColor['levels'][1], this.paintColor['levels'][2]), color(this.targetPixelColors[this.targetPixelIndex]['levels'][0], this.targetPixelColors[this.targetPixelIndex]['levels'][1], this.targetPixelColors[this.targetPixelIndex]['levels'][2])]);

                        if(this.targetPixelIndex >= 0) {
                            this.targetPixelIndex -= 1;
                        }
                        
                        this.paintColor = color(0, 0, 0);

                        this.sprayPosition = -1;

                        playerOne.position -= 3;
                        this.targetPixelPosition -= 3;

                        if(playerOne.position < 2) {
                            reset();
                        }
                        

                    }
                }

                //console.log(this.paintedCorrect);
                // displaying target pixels that they painted correctly
                for(let i = 0; i < this.paintedCorrect.length; i++) {
                    //display.setPixel(displaySize - (3*(i+1) + 2), this.paintedCorrect[i][0]);
                    //display.setBorderedPixel(displaySize - (3*(i+1) + 2), this.paintedCorrect[i][1]);

                    display.setPixel(displaySize - (3*(i+1) + 2), this.paintedCorrect[i][1]);
                    display.setPixel(displaySize - (3*(i+1) + 2) + 1, this.paintedCorrect[i][1]);
                }
                
                break;
 
            case "SUCCESS":       
                break;

            case "FAIL":
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

    controller.targetPixelPosition = playerOne.position - 2;
    controller.targetPixelColors = [];
    for(let i = 0; i < 8; i++) {
        controller.targetPixelColors.push(controller.generate_random_color())
    }
    controller.targetPixelIndex = controller.targetPixelColors.length - 1;

    display.setFloorColors(controller.targetPixelColors);
    
    controller.spraying = false;
    controller.sprayPosition = -1;

    controller.painted = false;
    controller.paintColor = color(0, 0, 0);

    controller.painted2 = false;
    controller.paintColor2 = color(0, 0, 0);

    controller.paintedCorrect = [];

    controller.justMatched = false;
    controller.sprayTimeout = true;
}


function keyReleased() {

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
    }

    if(key == 'D' || key == 'd') {
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
        reset();
        
    }
}


// to add:
// erase button
// player climbing animation, cleaner climbing animation
// floor colors that continue from the last round