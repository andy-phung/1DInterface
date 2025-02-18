#include <RotaryEncoder.h>
#include <Keyboard.h>


// clk to a0, dt to a1
RotaryEncoder encoder(A0, A1);

void setup()
{
  Keyboard.begin();

  // button pin
  pinMode(9, INPUT_PULLUP);
  
  Serial.begin(57600);
  
  
} 


void loop()
{
  static int pos = 0;
  encoder.tick();

  int newPos = encoder.getPosition();
  if (pos != newPos) {
    Serial.print(newPos);
    Serial.println();
    if(newPos > pos) {
      Keyboard.write(72);
    }

    if(newPos < pos) {
      Keyboard.write(74);
    }
    pos = newPos;
  }

  if(digitalRead(9) == LOW) { // spams paint/unpaint if you hold it ..
    delay(250);
    Keyboard.write(83);
    
  }
}