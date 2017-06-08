#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

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

void getJson () {
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
      Serial.println(vibrationFrq);
    }
    http.end();   //Close connection
  }
}




void loop() {

  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;   
    if (ledState == LOW) {
      ledState = HIGH;  // Note that this switches the LED *off*
      getJson();  }
    else
      ledState = LOW;   // Note that this switches the LED *on*
    digitalWrite(LED_BUILTIN, ledState);
  }
  
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
