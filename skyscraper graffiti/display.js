// This is used to aggregrate visual information from all objects before we display them. 
// First we populate display and then we show it to user.
// This is particularly helpful once you start outputting your game to an LED strip, of if you want to have two separate 'screens'


class Display {

    constructor(_displaySize, _pixelSize, _canvasWidth) {
  
      this.displaySize = _displaySize;
      this.pixelSize = _pixelSize;
      this.initColor = color(0, 0, 0);      // black color
      this.displayBuffer = [];
      this.borderDisplayBuffer = [];
      this.offset = _canvasWidth/2 - this.pixelSize/2;
      this.filled;
      this.floorColors = [];

      // Assign black to all pixels. Black = off
      for(let i = 0; i < this.displaySize; i++){
        this.displayBuffer[i] = this.initColor;
        this.borderDisplayBuffer[i] = color(0, 0, 0, 0);
      }
  
    }
  
     // Color a specific pixel in the buffer
    setPixel(  _index,  _color) {
        this.displayBuffer[_index]  = _color;
    }

    setBorderedPixel(  _index,  _color) {
        this.borderDisplayBuffer[_index]  = _color;
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

    show() {
      // sky, wip
      fill(10, 175, 255);
      rect(0, 0, this.pixelSize*2, this.displaySize*this.pixelSize);
      rect(this.offset + this.pixelSize*4, 0, this.pixelSize*2, this.displaySize*this.pixelSize);

      // building, wip
      fill(140, 140, 140);
      for (let i = 0; i < 10; i++) {
        rect(this.offset - this.pixelSize*3, this.pixelSize + this.pixelSize*3*i, this.pixelSize*7, this.pixelSize)
      }

      // building floor colors, wip
      for(let i = 0; i < this.floorColors.length; i++) {
        fill(this.floorColors[i]);
        rect(this.offset - this.pixelSize*3, this.pixelSize*2 + this.pixelSize*3*i, this.pixelSize*3, this.pixelSize*2);
        rect(this.offset + this.pixelSize, this.pixelSize*2 + this.pixelSize*3*i, this.pixelSize*3, this.pixelSize*2);
      }

      // sky pt 2
      // fill(10, 175, 255);

      // for(let i = 0; i < this.floorColors.length + 1; i++) {
      //   rect(this.offset - this.pixelSize*3, this.pixelSize*2 + this.pixelSize*3*i, this.pixelSize, this.pixelSize*2);
      //   rect(this.offset + this.pixelSize*3, this.pixelSize*2 + this.pixelSize*3*i, this.pixelSize, this.pixelSize*2);
      // }


      for (let i = 0; i< this.displaySize; i++) {
        //noStroke();
        if(!this.is_black(this.displayBuffer[i])) {
          fill(this.displayBuffer[i]);
          rect(0+this.offset, i*this.pixelSize, this.pixelSize, this.pixelSize);
        }
        
      }

      for (let i =0; i< this.displaySize; i++) {
        //noStroke();
        noFill();
        stroke(this.borderDisplayBuffer[i]);
        strokeWeight(3);
        rect(0+this.offset, i*this.pixelSize, this.pixelSize, this.pixelSize);
        noStroke();
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