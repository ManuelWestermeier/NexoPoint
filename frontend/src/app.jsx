import React, { useState, useRef } from "react";

function DeviceList({ devices, onSelect }) {
  return (
    <div>
      <h2>Available Bluetooth Devices</h2>
      <ul>
        {devices.map((device, index) => (
          <li key={index}>
            <button onClick={() => onSelect(device)}>
              {device.name || "Unnamed Device"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessageForm({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button type="submit">Send</button>
    </form>
  );
}

function MessageList({ messages }) {
  return (
    <div>
      <h2>Received Messages</h2>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [messages, setMessages] = useState([]);
  const bluetoothServerRef = useRef(null);
  const writeCharacteristicRef = useRef(null);

  const requestBluetoothDevices = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        // acceptAllDevices: true,
        filters: [{ name: "NexoPoint" }],
      });
      setDevices([device]);
    } catch (error) {
      console.error("Bluetooth error:", error);
    }
  };

  const connectToDevice = async (device) => {
    try {
      const server = await device.gatt.connect();
      bluetoothServerRef.current = server;
      setConnectedDevice(device);

      const service = await server.getPrimaryService(
        "0000ffe0-0000-1000-8000-00805f9b34fb"
      );
      const characteristic = await service.getCharacteristic(
        "0000ffe1-0000-1000-8000-00805f9b34fb"
      );
      writeCharacteristicRef.current = characteristic;

      await characteristic.startNotifications();
      characteristic.addEventListener("characteristicvaluechanged", (event) => {
        const value = new TextDecoder().decode(event.target.value);
        setMessages((prev) => [...prev, value]);
      });
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleSendMessage = async (message) => {
    try {
      if (writeCharacteristicRef.current) {
        const encoder = new TextEncoder();
        await writeCharacteristicRef.current.writeValue(
          encoder.encode(message + "\n")
        );
        setMessages((prev) => [...prev, "(You): " + message]);
      }
    } catch (error) {
      console.error("Send failed:", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Bluetooth Messenger</h1>
      {!connectedDevice && (
        <button onClick={requestBluetoothDevices} className="mb-4">
          Scan for Devices
        </button>
      )}
      {!connectedDevice && (
        <DeviceList devices={devices} onSelect={connectToDevice} />
      )}
      {connectedDevice && (
        <>
          <p>Connected to: {connectedDevice.name || "Unnamed Device"}</p>
          <MessageForm onSend={handleSendMessage} />
          <MessageList messages={messages} />
        </>
      )}
    </div>
  );
}
