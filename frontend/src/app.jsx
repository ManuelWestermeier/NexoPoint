import { useState, useEffect } from "react";

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
  const [bluetoothServer, setBluetoothServer] = useState(null);

  const requestBluetoothDevices = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"], // or your desired service
      });
      setDevices([device]);
    } catch (error) {
      console.error("Bluetooth error:", error);
    }
  };

  const connectToDevice = async (device) => {
    try {
      const server = await device.gatt.connect();
      setConnectedDevice(device);
      setBluetoothServer(server);
      // Add listener/handlers to receive messages here
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleSendMessage = (message) => {
    // Placeholder: implement sending via GATT characteristic
    console.log("Sending message:", message);
  };

  useEffect(() => {
    requestBluetoothDevices();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Bluetooth Messenger</h1>
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
