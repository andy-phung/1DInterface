#include <Keyboard.h>


// not my code

int buttonState;            // the current reading from the input pin
int lastButtonState = LOW;  // the previous reading from the input pin

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastDebounceTime = 0;  // the last time the output pin was toggled
unsigned long debounceDelay = 50;    // the debounce time; increase if the output flickers



void setup()
{
  Keyboard.begin();

  // button pin
  pinMode(9, INPUT_PULLUP);

  // tilt sensor pin
  pinMode(7, INPUT_PULLUP);
  
  Serial.begin(57600);
  
  
} 


void loop()
{


  // paint button
  if(digitalRead(9) == LOW) {
    Keyboard.press(71); // mapped to G
    Serial.println("paint");
    delay(300); 
  } else {
    Keyboard.release(71); // so u can hold down to keep painting a color
  }





  // tilt sensor

  
  // i stole this code
 

  int reading = digitalRead(7);

  

  // check to see if you just pressed the button
  // (i.e. the input went from LOW to HIGH), and you've waited long enough
  // since the last press to ignore any noise:

  // If the switch changed, due to noise or pressing:
  if (reading != lastButtonState) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer than the debounce
    // delay, so take it as the actual current state:

    

    // if the button state has changed:
    if (reading != buttonState) {
      buttonState = reading;

      // only toggle the LED if the new button state is HIGH
      if (buttonState == HIGH) {
        Keyboard.write(72);
        Serial.println("right 1");
        //delay(500);
      }
    } else if(lastButtonState == HIGH && reading == HIGH) {
      if((millis() - lastDebounceTime) > debounceDelay * 5) {
        delay(500);
        Serial.println("right 2");
        Keyboard.write(72);
      }
    }
    
  }
  

  // save the reading. Next time through the loop, it'll be the lastButtonState:
  lastButtonState = reading;
  
}