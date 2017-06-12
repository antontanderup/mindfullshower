#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <FastLED.h>

#define NUM_LEDS 12
#define LEDPin D5

CRGB leds[NUM_LEDS];

const char* ssid = "iPhone 5s";
const char* password = "12345678";

const int buttonPin = D7;
const int vibratorPin = D6;

int buttonState = 0;
int chakraColor = 0;
int vibrationFrq = 0;

unsigned long previousMillis = 0;
const long interval = 1000;
int ledState = LOW; 

void setup () {
  
  FastLED.addLeds<NEOPIXEL, LEDPin>(leds, NUM_LEDS);
  
  pinMode(buttonPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(vibratorPin, OUTPUT);
  
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {

    delay(1000);
    Serial.print("Connecting..");

  }

}


void buttonPress(bool state) {
  String url = "";
  if (state) {
      url = "http://antontanderup.dk/projects/mindfullshower/php/buttonpressed.php";
  }  
  else {
      url = "http://antontanderup.dk/projects/mindfullshower/php/buttonunpressed.php";
    }
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    HTTPClient http;  //Declare an object of class HTTPClient

    http.begin(url);  //Specify request destination
               int httpCode = http.GET();   //Send the request

    if (httpCode > 0) { //Check the returning code
      Serial.println("Retrieved...");                    
    }
    http.end();   //Close connection
  }
}

void animateLED() {
  Serial.print("animateLED ");
  for (int i=0; i <= 12; i++){
    switch (chakraColor) {
    case 1: 
      leds[i] = CRGB( 255,0,0);
      Serial.println("case 1");
      break;
    case 2:  
      leds[i] = CRGB( 255,106,0);
      Serial.println("case 2");
      break;
    case 3:  
      leds[i] = CRGB( 168,255,0);
      Serial.println("case 3");
      Serial.println(i);
      break;
    case 4: 
      leds[i] = CRGB( 0,255,51);
      Serial.println("case 4");
      break;
    case 5:  
      leds[i] = CRGB( 0,122,255);
      Serial.println("case 5");
      break;
    case 6:  
      leds[i] = CRGB( 34,0,255);
      Serial.println("case 6");
      break;
    case 7:  
      leds[i] = CRGB( 93,0,199);
      Serial.println("case 7");
      break;
    default: 
      leds[i] = CRGB( 255,255,255);
      Serial.println("case default");
      break;
    }
  } 
  FastLED.show();
}

void getJson () {
  Serial.println("getJson startet");
  ledState = LOW;
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    HTTPClient http;  //Declare an object of class HTTPClient 
    http.begin("http://antontanderup.dk/projects/mindfullshower/server.json");  //Specify request destination
    int httpCode = http.GET();                                                  //Send the request
 
    if (httpCode > 0) { //Check the returning code
 
      String payload = http.getString();   //Get the request response payload
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.parseObject(payload);
      chakraColor = root["chakra"];
      vibrationFrq = root["vibration"];
      Serial.println(chakraColor);
      Serial.print(vibrationFrq); 
    }
    http.end();   //Close connection
  }
  ledState = HIGH;
}

void loop() {

  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;   
    getJson();
    animateLED();
  }
  
  digitalWrite(LED_BUILTIN, ledState);
  analogWrite(vibratorPin, vibrationFrq);

  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);
  
  // check if the pushbutton is pressed.
  // if it is, the buttonState is HIGH:
  if (buttonState == HIGH) {
    buttonPress(true);
    delay(5000);
  } else {
    buttonPress(false);
  }
  
}
