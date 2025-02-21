#include <Keyboard.h>

int buttonState;            // the current reading from the input pin
int lastButtonState = LOW;  // the previous reading from the input pin

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastDebounceTime = 0;  // the last time the output pin was toggled
unsigned long debounceDelay = 100;    // the debounce time; increase if the output flickers

int buttonState2;            // the current reading from the input pin
int lastButtonState2 = LOW;  // the previous reading from the input pin

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastDebounceTime2 = 0;  // the last time the output pin was toggled
unsigned long debounceDelay2 = 100;    // the debounce time; increase if the output flickers


void setup()
{
  Keyboard.begin();

  // button pin
  pinMode(9, INPUT_PULLUP);
  pinMode(8, INPUT_PULLUP);
  pinMode(7, INPUT_PULLUP);
  
  Serial.begin(57600);
  
  
} 


void loop()
{

  if(digitalRead(9) == LOW) { // spams paint/unpaint if you hold it ..
    Keyboard.write(83);
    Serial.println("paint");
    delay(300);
    
  }



  

  int reading2 = digitalRead(8);

  // check to see if you just pressed the button
  // (i.e. the input went from LOW to HIGH), and you've waited long enough
  // since the last press to ignore any noise:

  // If the switch changed, due to noise or pressing:
  if (reading2 != lastButtonState2) {
    // reset the debouncing timer
    lastDebounceTime2 = millis();
  }

  if ((millis() - lastDebounceTime2) > debounceDelay) {
    // whatever the reading is at, it's been there for longer than the debounce
    // delay, so take it as the actual current state:

    

    // if the button state has changed:
    if (reading2 != buttonState2) {
      buttonState2 = reading2;

      // only toggle the LED if the new button state is HIGH
      if (buttonState2 == HIGH) {
        Keyboard.write(65);
        Serial.println("left 1");
        //delay(500);
      }
    } else if(lastButtonState2 == HIGH && reading2 == HIGH) {
      if((millis() - lastDebounceTime2) > debounceDelay * 5) {
        delay(500);
        Serial.println("left 2");
        Keyboard.write(65);
      }
    }
    
  }


  // save the reading. Next time through the loop, it'll be the lastButtonState:
  lastButtonState2 = reading2;




  
  

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
        Keyboard.write(68);
        Serial.println("right 1");
        //delay(500);
      }
    } else if(lastButtonState == HIGH && reading == HIGH) {
      if((millis() - lastDebounceTime) > debounceDelay * 5) {
        delay(500);
        Serial.println("right 2");
        Keyboard.write(68);
      }
    }
    
  }

  

  // save the reading. Next time through the loop, it'll be the lastButtonState:
  lastButtonState = reading;
  
}