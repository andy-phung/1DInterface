// This is used to aggregrate visual information from all objects before we display them. 
// First we populate display and then we show it to user.
// This is particularly helpful once you start outputting your game to an LED strip, of if you want to have two separate 'screens'


class Display {

    constructor(_displaySize, _pixelSize, _canvasWidth) {
  
      this.displaySize = _displaySize;
      this.pixelSize = _pixelSize;
      this.initColor = color(255, 255, 255);      // black color
      this.displayBuffer = [];
      this.widePixels = [];
      this.borderDisplayBuffer = [];
      this.borderThicknesses = [];
      this.offset = _canvasWidth/2 - this.pixelSize/2;
      // this.offset = 0;
      this.filled;
      this.floorColors = [];

      // Assign black to all pixels. Black = off
      for(let i = 0; i < this.displaySize; i++){
        this.displayBuffer[i] = this.initColor;
        this.borderDisplayBuffer[i] = color(0, 0, 0, 0);
        this.widePixels[i] = false;
        this.borderThicknesses[i] = 0;
      }
  
    }
  
     // Color a specific pixel in the buffer
    setPixel(  _index,  _color, _wide = false) {
        this.displayBuffer[_index]  = _color;
        if(_wide) {
          this.widePixels[_index] = _wide;
        }
    }

    setBorderedPixel(  _index,  _color, _thickness) {
        this.borderDisplayBuffer[_index]  = _color;
        this.borderThicknesses[_index] = _thickness;
        //console.log(_color);
        
  }

    // Color all pixels in the buffer
    setAllPixels( _color) {
      for(let i = 0; i < displaySize; i++) { 
        display.setPixel(i, _color); 
      }
    }

    setFloorColors(_floorColors) {
      this.floorColors = _floorColors;
    }

    is_black(color) {
      return color['levels'][0] == 0 && color['levels'][1] == 0 && color['levels'][2] == 0;
    }

    is_white(color) {
      return color['levels'][0] == 255 && color['levels'][1] == 255 && color['levels'][2] == 255;
    }

    show() {
      // sky, wip
      fill(10, 175, 255);
      rect(0, 0, this.pixelSize*51, this.displaySize*this.pixelSize);

      // building, wip
      fill(0, 0, 0);
      for (let i = 0; i < 10; i++) {
        rect(this.offset - this.pixelSize*3, this.pixelSize + this.pixelSize*4*i, this.pixelSize*7, this.pixelSize)
      }
      rect(this.offset - this.pixelSize*3, 0, this.pixelSize, this.pixelSize*this.displaySize);
      rect(this.offset + this.pixelSize*3, 0, this.pixelSize, this.pixelSize*this.displaySize);
      
      this.drawClouds();

      // building floor colors, wip
      for(let i = 0; i < this.floorColors.length; i++) {
        fill(255);
        rect(this.offset - this.pixelSize*3, this.pixelSize*3*i, this.pixelSize*6, this.pixelSize*4);
        // rect(this.offset + this.pixelSize, this.pixelSize*2 + this.pixelSize*3*i, this.pixelSize*3, this.pixelSize*2);
      }

      // sky pt 2
      // fill(10, 175, 255);

      // for(let i = 0; i < this.floorColors.length + 1; i++) {
      //   rect(this.offset - this.pixelSize*3, this.pixelSize*2 + this.pixelSize*3*i, this.pixelSize, this.pixelSize*2);
      //   rect(this.offset + this.pixelSize*3, this.pixelSize*2 + this.pixelSize*3*i, this.pixelSize, this.pixelSize*2);
      // }

      // spray painted color of each floor
      for (let i = 0; i< this.displaySize; i++) {
        //noStroke();
        if(!this.is_white(this.displayBuffer[i]) && !this.widePixels[i]) {
          fill(this.displayBuffer[i]);
          rect(this.offset, i*this.pixelSize, this.pixelSize, this.pixelSize);
        } else if(this.widePixels[i]) {
          fill(this.displayBuffer[i]);
          rect(this.offset - this.pixelSize*2, i*this.pixelSize, this.pixelSize*5, this.pixelSize);
        }
      }

      // borders
      for (let i =0; i< this.displaySize; i++) {
        //noStroke();
        noFill();
        stroke(this.borderDisplayBuffer[i]);
        strokeWeight(this.borderThicknesses[i]);
        if(this.borderThicknesses[i] != 2) {
          // floor border
          rect(0+this.offset - this.pixelSize*2 + 5, i*this.pixelSize, this.pixelSize*5 - 10, this.pixelSize*3 - 5);
        } else {
          // player border
          rect(0+this.offset + 1, i*this.pixelSize, this.pixelSize - 1, this.pixelSize - 1);
        }
        noStroke();
      }



    }

    /**
     * Draws pixelated clouds in the sky, using white rectangles.
     */
    drawClouds() {
      fill(255); // White color for clouds
  
      let cloudPositions = [
          { x: 4, y: 3 },   // Left side cloud
          { x: 14, y: 5 },  // Left side cloud
          { x: 36, y: 4 },  // Right side cloud
          { x: 45, y: 6 }   // Right side cloud
      ];
  
      for (let cloud of cloudPositions) {
          let cx = cloud.x * this.pixelSize;
          let cy = cloud.y * this.pixelSize;
  
          // Ensure clouds are placed outside the restricted middle range
          if (cx < this.offset - this.pixelSize * 3 || cx > this.offset + this.pixelSize * 3) {
              // Draw a pixelated cloud (3-row blocky structure)
              rect(cx, cy, this.pixelSize * 3, this.pixelSize);   // Top row
              rect(cx - this.pixelSize, cy + this.pixelSize, this.pixelSize * 5, this.pixelSize); // Middle row
              rect(cx, cy + this.pixelSize * 2, this.pixelSize * 3, this.pixelSize);  // Bottom row
          }
      }
    }
  


    
    // Let's empty the display before we start adding things to it again
    clear() {

        for(let i = 0; i < this.displaySize; i++) {    
        this.displayBuffer[i] = this.initColor; 
        noStroke();
        this.borderDisplayBuffer[i] = color(0, 0, 0, 0);
        }
    }
    

  }