import React, { useState , useEffect} from "react";
import genAI from "../utils/geminiClient";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ChatSupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "model", text: "Welcome to SmartStock! How can I assist you today?" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const [trimmedInventory, setTrimmedInventory] = useState([]);

  
  const contextJSON = JSON.stringify(trimmedInventory, null, 2);
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    const inventoryRef = collection(db, "users", user.uid, "inventory");
    const snapshot = await getDocs(inventoryRef);
  
    const inventoryData = snapshot.docs.map(doc => ({
      productId: doc.id,
      ...doc.data()
    }));

    setTrimmedInventory(inventoryData);
  };


  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMsg = { sender: "user", text: newMessage };
    setMessages(prev => [...prev, userMsg]);
    setChatHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: newMessage }] }
      ]);
    try {

        const chat = genAI.chats.create({
            model: "gemini-2.0-flash",
            history: chatHistory,
            config: {
                systemInstruction: `You are a helpful assistant for SmartStock, an inventory management system. Please provide accurate and concise answers to user queries. If the user wants to place an order, ask for any missing values from the following fields: productId, productName, category, quantity, and productPrice. Use the data given to you: ${contextJSON}. Only answer based on this inventory.`,
            }
        });

        const result = await chat.sendMessage({
            message: newMessage,
          });
        const reply = result.text;
        const botMessage = { text: reply, sender: 'model' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setChatHistory(prev => [
            ...prev,
            { role: "model", parts: [{ text: reply }] }
          ]);
      } catch (error) {
        console.error("Gemini error:", error);
        setMessages(prev => [...prev, { sender: "model", text: "Sorry, there was an error getting a response." }]);
      }

      setNewMessage("");
  };

  return (
    <div className="fixed bottom-10 right-6 z-50">
      {isOpen && (
        <div className="w-100 h-126 bg-white shadow-lg rounded-xl flex flex-col mb-4">
          <div className="bg-gray-800 text-white p-3 rounded-t-xl font-semibold">
            Chat Support
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-sm px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "model"
                    ? "bg-gray-100 text-black self-start"
                    : "bg-gray-700 text-white self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-gray-800 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleToggleChat}
        className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg"
      >
        {isOpen ? "Close Chat" : "Chat with Us"}
      </button>
    </div>
  );
};

export default ChatSupportWidget;
