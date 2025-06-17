#include <Arduino.h>
#include "BluetoothSerial.h"

// Ensure Bluetooth is enabled on ESP32
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please enable it in menuconfig
#endif

BluetoothSerial SerialBT;

void setup()
{
  Serial.begin(115200);
  SerialBT.begin("ESP32_Echo"); // Bluetooth device name
  Serial.println("Bluetooth Echo App Started. Pair to 'ESP32_Echo'");

  // Send hello message over Bluetooth
  SerialBT.println("Hello from ESP32_Echo");
}

void loop()
{
  static String incoming = "";

  while (SerialBT.available())
  {
    char c = SerialBT.read();
    if (c == '\n')
    {
      Serial.print("Received: ");
      Serial.println(incoming);
      SerialBT.println("Echo: " + incoming);
      incoming = ""; // Clear for next message
    }
    else if (c != '\r')
    {
      incoming += c;
    }
  }

  delay(10); // Small delay to avoid busy loop
}
