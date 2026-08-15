/**
 * The exact Arduino sketch this console is a faithful software twin of.
 * Every timing constant and threshold in src/lib/* is ported from here —
 * see the "Firmware map" table in CircuitSection.tsx for the crosswalk.
 */
export const FIRMWARE_SOURCE = `#include <DHT.h>
#include <LiquidCrystal.h>


#define DHT_PIN 2
#define DHT_TYPE DHT11

DHT dht(DHT_PIN, DHT_TYPE);



#define MOISTURE_PIN A0



#define BUZZER_PIN 9



#define RELAY_PIN 10

#define RELAY_ON LOW
#define RELAY_OFF HIGH



#define BUTTON_MILK 11
#define BUTTON_MEAT 12
#define BUTTON_FRUIT A1
#define BUTTON_VEG A2



LiquidCrystal lcd(7, 6, 5, 4, 3, 8);



enum FoodType {

  MILK,
  MEAT,
  FRUIT,
  VEGETABLE

};

FoodType selectedFood = MEAT;




float temperature = 0;
float humidity = 0;

int moistureRaw = 0;
int moisturePercent = 0;


int riskScore = 0;

String statusText = "STARTING";



unsigned long lastSensorRead = 0;

unsigned long lastLCDUpdate = 0;

unsigned long lastBeep = 0;

unsigned long storageStart = 0;



const unsigned long SENSOR_INTERVAL = 2000;


const unsigned long LCD_INTERVAL = 3000;



int lcdScreen = 0;



unsigned long lastButtonPress = 0;

const unsigned long BUTTON_DELAY = 300;


void setup() {

  Serial.begin(9600);

  dht.begin();


  pinMode(MOISTURE_PIN, INPUT);

  pinMode(BUZZER_PIN, OUTPUT);

  pinMode(RELAY_PIN, OUTPUT);



  pinMode(BUTTON_MILK, INPUT_PULLUP);

  pinMode(BUTTON_MEAT, INPUT_PULLUP);

  pinMode(BUTTON_FRUIT, INPUT_PULLUP);

  pinMode(BUTTON_VEG, INPUT_PULLUP);



  digitalWrite(BUZZER_PIN, LOW);

  digitalWrite(RELAY_PIN, RELAY_OFF);



  lcd.begin(16, 2);

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print("FOOD GUARDIAN");

  lcd.setCursor(0, 1);

  lcd.print("Initializing...");


  delay(2000);



  storageStart = millis();


  lcd.clear();


  Serial.println();

  Serial.println("==============================");

  Serial.println(" FOOD FRESHNESS MONITOR");

  Serial.println("==============================");

  Serial.println("System Started");

  Serial.println();


  showFoodSelection();

}



void loop() {

  unsigned long currentMillis = millis();



  checkButtons();


  if (currentMillis - lastSensorRead >= SENSOR_INTERVAL) {

    lastSensorRead = currentMillis;

    readSensors();

    calculateRisk();

    controlFan();

    controlBuzzer();

    printSerialData();

  }


  if (currentMillis - lastLCDUpdate >= LCD_INTERVAL) {

    lastLCDUpdate = currentMillis;

    displayLCD();

  }

}



void checkButtons() {

  if (millis() - lastButtonPress < BUTTON_DELAY) {

    return;

  }


  if (digitalRead(BUTTON_MILK) == LOW) {

    selectedFood = MILK;

    lastButtonPress = millis();

    storageStart = millis();

    lcdScreen = 0;

    showFoodSelection();

  }



  else if (digitalRead(BUTTON_MEAT) == LOW) {

    selectedFood = MEAT;

    lastButtonPress = millis();

    storageStart = millis();

    lcdScreen = 0;

    showFoodSelection();

  }


  else if (digitalRead(BUTTON_FRUIT) == LOW) {

    selectedFood = FRUIT;

    lastButtonPress = millis();

    storageStart = millis();

    lcdScreen = 0;

    showFoodSelection();

  }



  else if (digitalRead(BUTTON_VEG) == LOW) {

    selectedFood = VEGETABLE;

    lastButtonPress = millis();

    storageStart = millis();

    lcdScreen = 0;

    showFoodSelection();

  }

}



void readSensors() {

  float newHumidity = dht.readHumidity();

  float newTemperature = dht.readTemperature();



  if (isnan(newHumidity) || isnan(newTemperature)) {

    Serial.println("ERROR: DHT11 reading failed!");

    return;

  }


  humidity = newHumidity;

  temperature = newTemperature;



  moistureRaw = analogRead(MOISTURE_PIN);



  moisturePercent = map(

    moistureRaw,

    1023,

    0,

    0,

    100

  );


  moisturePercent = constrain(

    moisturePercent,

    0,

    100

  );

}



void calculateRisk() {

  riskScore = 0;



  if (selectedFood == MILK) {



    if (temperature >= 35) {

      riskScore += 45;

    }

    else if (temperature >= 30) {

      riskScore += 35;

    }

    else if (temperature >= 25) {

      riskScore += 20;

    }



    if (humidity >= 85) {

      riskScore += 30;

    }

    else if (humidity >= 75) {

      riskScore += 20;

    }

    else if (humidity >= 65) {

      riskScore += 10;

    }



    if (moisturePercent >= 80) {

      riskScore += 25;

    }

    else if (moisturePercent >= 60) {

      riskScore += 15;

    }

  }


  else if (selectedFood == MEAT) {


    if (temperature >= 35) {

      riskScore += 45;

    }

    else if (temperature >= 30) {

      riskScore += 35;

    }

    else if (temperature >= 25) {

      riskScore += 20;

    }



    if (humidity >= 85) {

      riskScore += 30;

    }

    else if (humidity >= 75) {

      riskScore += 20;

    }

    else if (humidity >= 65) {

      riskScore += 10;

    }



    if (moisturePercent >= 80) {

      riskScore += 25;

    }

    else if (moisturePercent >= 60) {

      riskScore += 15;

    }

  }



  else if (selectedFood == FRUIT) {



    if (temperature >= 35) {

      riskScore += 30;

    }

    else if (temperature >= 30) {

      riskScore += 20;

    }

    else if (temperature >= 27) {

      riskScore += 10;

    }



    if (humidity >= 90) {

      riskScore += 40;

    }

    else if (humidity >= 80) {

      riskScore += 30;

    }

    else if (humidity >= 70) {

      riskScore += 15;

    }



    if (moisturePercent >= 80) {

      riskScore += 30;

    }

    else if (moisturePercent >= 60) {

      riskScore += 20;

    }

  }



  else if (selectedFood == VEGETABLE) {


    if (temperature >= 35) {

      riskScore += 30;

    }

    else if (temperature >= 30) {

      riskScore += 20;

    }

    else if (temperature >= 27) {

      riskScore += 10;

    }



    if (humidity >= 90) {

      riskScore += 40;

    }

    else if (humidity >= 80) {

      riskScore += 30;

    }

    else if (humidity >= 70) {

      riskScore += 15;

    }



    if (moisturePercent >= 80) {

      riskScore += 30;

    }

    else if (moisturePercent >= 60) {

      riskScore += 20;

    }

  }



  riskScore = constrain(

    riskScore,

    0,

    100

  );


  if (riskScore <= 25) {

    statusText = "SAFE";

  }

  else if (riskScore <= 50) {

    statusText = "WARNING";

  }

  else if (riskScore <= 75) {

    statusText = "HIGH RISK";

  }

  else {

    statusText = "CRITICAL";

  }

}



void controlFan() {



  if (riskScore <= 25) {

    digitalWrite(

      RELAY_PIN,

      RELAY_OFF

    );

  }


  else {

    digitalWrite(

      RELAY_PIN,

      RELAY_ON

    );

  }

}



void controlBuzzer() {



  if (riskScore <= 50) {

    noTone(BUZZER_PIN);

    return;

  }



  if (riskScore <= 75) {

    if (millis() - lastBeep >= 3000) {

      lastBeep = millis();

      tone(

        BUZZER_PIN,

        2000,

        300

      );

    }

  }



  else {

    if (millis() - lastBeep >= 1000) {

      lastBeep = millis();

      tone(

        BUZZER_PIN,

        2500,

        500

      );

    }

  }

}



void showFoodSelection() {

  lcd.clear();


  lcd.setCursor(0, 0);

  lcd.print("FOOD SELECTED:");


  lcd.setCursor(0, 1);

  lcd.print(getFoodName());


  delay(1000);

}



String getFoodName() {

  if (selectedFood == MILK) {

    return "MILK";

  }

  else if (selectedFood == MEAT) {

    return "MEAT";

  }

  else if (selectedFood == FRUIT) {

    return "FRUIT";

  }

  else {

    return "VEGETABLE";

  }

}



void displayLCD() {

  lcd.clear();



  if (lcdScreen == 0) {

    lcd.setCursor(0, 0);

    lcd.print("FOOD:");

    lcd.print(getFoodName());


    lcd.setCursor(0, 1);

    lcd.print("T:");

    lcd.print(temperature, 1);

    lcd.print("C H:");

    lcd.print(humidity, 0);

    lcd.print("%");

  }



  else if (lcdScreen == 1) {

    lcd.setCursor(0, 0);

    lcd.print("MOISTURE:");

    lcd.print(moisturePercent);

    lcd.print("%");


    lcd.setCursor(0, 1);

    lcd.print("RISK:");

    lcd.print(riskScore);

    lcd.print("%");

  }



  else if (lcdScreen == 2) {

    lcd.setCursor(0, 0);

    lcd.print("STATUS:");

    lcd.setCursor(0, 1);

    lcd.print(statusText);

  }


  else if (lcdScreen == 3) {

    unsigned long elapsed =

      millis() - storageStart;


    unsigned long totalSeconds =

      elapsed / 1000;


    unsigned int hours =

      totalSeconds / 3600;


    unsigned int minutes =

      (totalSeconds % 3600) / 60;


    lcd.setCursor(0, 0);

    lcd.print("STORAGE TIME");


    lcd.setCursor(0, 1);


    if (hours < 10) {

      lcd.print("0");

    }

    lcd.print(hours);

    lcd.print("h ");


    if (minutes < 10) {

      lcd.print("0");

    }

    lcd.print(minutes);

    lcd.print("m");

  }



  else if (lcdScreen == 4) {

    lcd.setCursor(0, 0);

    lcd.print("FAN:");

    if (riskScore > 25) {

      lcd.print("ON");

    }

    else {

      lcd.print("OFF");

    }


    lcd.setCursor(0, 1);

    if (riskScore > 75) {

      lcd.print("CHECK FOOD!");

    }

    else if (riskScore > 50) {

      lcd.print("HIGH RISK");

    }

    else if (riskScore > 25) {

      lcd.print("VENTILATING");

    }

    else {

      lcd.print("MONITORING");

    }

  }



  lcdScreen++;


  if (lcdScreen > 4) {

    lcdScreen = 0;

  }

}



void printSerialData() {

  Serial.println("------------------------------");


  Serial.print("Food        : ");

  Serial.println(getFoodName());


  Serial.print("Temperature : ");

  Serial.print(temperature);

  Serial.println(" C");


  Serial.print("Humidity    : ");

  Serial.print(humidity);

  Serial.println(" %");


  Serial.print("Moisture    : ");

  Serial.print(moisturePercent);

  Serial.println(" %");


  Serial.print("Risk Score  : ");

  Serial.print(riskScore);

  Serial.println(" %");


  Serial.print("Status      : ");

  Serial.println(statusText);


  Serial.print("Fan         : ");

  if (riskScore > 25) {

    Serial.println("ON");

  }

  else {

    Serial.println("OFF");

  }



  unsigned long elapsed =

    millis() - storageStart;


  unsigned long totalSeconds =

    elapsed / 1000;


  unsigned int hours =

    totalSeconds / 3600;


  unsigned int minutes =

    (totalSeconds % 3600) / 60;


  Serial.print("Storage     : ");

  Serial.print(hours);

  Serial.print("h ");

  Serial.print(minutes);

  Serial.println("m");


  Serial.println("------------------------------");

}
`;
