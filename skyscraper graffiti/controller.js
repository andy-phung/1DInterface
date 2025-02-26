
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.gameState = "PLAY";
        this.round = 1;

        playerOne.position = displaySize - 1;
        playerOne.colorCycle = [color(255, 0, 0), color(255, 255, 0), color(0, 255, 0), color(0, 255, 255), color(0, 0, 255), color(255, 0, 255)];
        playerOne.currentColorIndex = 0;

        this.targetPixelPosition = playerOne.position - 4;
        this.targetPixelColor = color(int(random(0, 256)), int(random(0, 256)), int(random(0, 256)));
        
        this.spraying = false;
        this.sprayPosition = -1;

        this.painted = false;
        this.paintColor = color(0, 0, 0);

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


            case "PLAY": 
                display.clear();

                // draw player
                display.setPixel(playerOne.position, playerOne.colorCycle[playerOne.currentColorIndex]);
                // draw target pixels
                display.setBorderedPixel(this.targetPixelPosition, this.targetPixelColor);

                if(this.spraying) {
                    this.sprayPosition -= 1;
                    if(this.sprayPosition == this.targetPixelPosition && this.painted == false) {
                        this.painted = true;
                        this.paintColor = playerOne.colorCycle[playerOne.currentColorIndex];
                        this.spraying = false;
                    } else if(this.sprayPosition == this.targetPixelPosition && this.painted == true) {
                        this.paintColor = this.mix([this.paintColor, playerOne.colorCycle[playerOne.currentColorIndex]]);
                        this.spraying = false;
                    }

                    display.setPixel(this.sprayPosition, playerOne.colorCycle[playerOne.currentColorIndex]);
                }

                if(this.painted) {
                    display.setPixel(this.targetPixelPosition, this.paintColor);
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


function keyReleased() {

}

function keyPressed() {
    if(key == 'S' || key == 's') {
        if(!controller.spraying) {
            controller.spraying = true;
            controller.sprayPosition = playerOne.position;
        }
    }

    if(key == 'W' || key == 'w') {
        if(playerOne.currentColorIndex < playerOne.colorCycle.length - 1) {
            playerOne.currentColorIndex += 1;
        } else {
            playerOne.currentColorIndex = 0;
        }
    }

    if(key == 'R' || key == 'r') {
        // temp
        controller.gameState = "PLAY";
        controller.round = 1;

        playerOne.position = displaySize - 1;
        playerOne.colorCycle = [color(255, 0, 0), color(255, 255, 0), color(0, 255, 0), color(0, 255, 255), color(0, 0, 255), color(255, 0, 255)];
        playerOne.currentColorIndex = 0;

        controller.targetPixelPosition = playerOne.position - 4;
        controller.targetPixelColor = color(int(random(0, 256)), int(random(0, 256)), int(random(0, 256)));
        
        controller.spraying = false;
        controller.sprayPosition = -1;

        controller.painted = false;
        controller.paintColor = color(0, 0, 0);
    }
}