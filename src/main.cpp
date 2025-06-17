#include <Arduino.h>

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Echo Callback Class
class EchoCallback : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic) override
  {
    std::string value = pCharacteristic->getValue();
    // Echo: Set value to whatever was written
    pCharacteristic->setValue(value);
    Serial.print("Echoed: ");
    Serial.println(value.c_str());
  }
};

void setup()
{
  Serial.begin(115200);

  BLEDevice::init("NexoPoint");
  BLEServer *pServer = BLEDevice::createServer();

  BLEService *pService = pServer->createService("00001234-0000-1000-8000-00805f9b34fb");

  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
      "abcd",
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);

  pCharacteristic->setValue("Hello");
  pCharacteristic->setCallbacks(new EchoCallback());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID("00001234-0000-1000-8000-00805f9b34fb");
  pAdvertising->start();

  Serial.println("BLE Echo Server Ready");
}

void loop()
{
}
