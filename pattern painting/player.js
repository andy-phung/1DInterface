
// This holds some player information, like color and position.
// It also has some player methods for managing how a player moves.


class Player {
  
    constructor(_displaySize) {
        this.paintColor;
        this.playerColor;
        this.position;
        this.score = 0;
        this.displaySize = _displaySize;
        this.painted_locations = {};
        this.pressed = false;
    }



    // Move player based on keyboard input
    move(_direction) {

        // increments or decrements player position
        this.position = this.position + _direction;
      
        // if player hits the edge of display, loop around
        if (this.position == -1) {
            this.position = this.displaySize - 1;
        } else if (this.position == this.displaySize) {
            this.position = 0;
        } 
         
    } 
  }