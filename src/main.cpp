#include <Arduino.h>

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

void setup()
{
  BLEDevice::init("NexoPoint");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService("1234");
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
      "abcd",
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  pCharacteristic->setValue("Hello");
  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->start();
}

void loop() {}