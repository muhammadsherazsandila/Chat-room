import { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiSmile, FiX } from "react-icons/fi";
import Picker from "emoji-picker-react";
import { UserList } from "./UserList.jsx";
import { Message } from "./Message.jsx";
const socket = io("http://localhost:3001");

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem("username") || "Anonymous";

  // Initialize socket connection
  useEffect(() => {
    if (!username) return;

    socket.emit("join", username);

    socket.on("user-connected", (username) => {
      toast.success(`${username} connected!`, {
        icon: "👋",
        style: {
          background: "#4ade80",
          color: "#fff",
        },
      });
    });

    socket.on("user-disconnected", (username) => {
      toast.error(`${username} disconnected!`, {
        icon: "🚪",
        style: {
          background: "#f87171",
          color: "#fff",
        },
      });
    });

    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user-list", (userList) => {
      setUsers(userList);
    });

    socket.on("init-data", (data) => {
      setMessages(data.messages);
      setUsers(data.users);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle sending messages
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      socket.emit("send-message", {
        text: messageInput,
        username,
        timestamp: new Date().toISOString(),
        replyTo: replyingTo?.id || null,
      });
      setMessageInput("");
      setReplyingTo(null);
      setShowEmojiPicker(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    console.log(emojiObject.emoji);
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  // Find reply message
  const getReplyMessage = (replyId) => {
    return messages.find((msg) => msg.id === replyId);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar - User List */}
      <div className="w-full md:w-80 bg-white p-6 shadow-lg hidden md:block">
        <UserList users={users} />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 shadow flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
              <span className="text-white font-bold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Roomify Chat</h1>
          </div>
          <div className="text-sm bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
            {users.length} online
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <Message
                key={msg.id}
                message={msg}
                onReply={setReplyingTo}
                isCurrentUser={msg.username === username}
                replyToMessage={
                  msg.replyTo ? getReplyMessage(msg.replyTo) : null
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t relative">
          {/* Reply Preview */}
          {replyingTo && (
            <div className="flex items-center justify-between mb-3 bg-cyan-50 p-3 rounded-lg">
              <div className="flex-1">
                <p className="text-xs font-medium text-cyan-700">
                  Replying to:
                </p>
                <p className="text-sm truncate">{replyingTo.text}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-cyan-700 hover:text-cyan-900 p-1"
              >
                <FiX size={18} />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full ${
                showEmojiPicker
                  ? "bg-cyan-100 text-cyan-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FiSmile size={20} />
            </motion.button>

            <div className="flex-1 relative">
              {showEmojiPicker && (
                <motion.div
                  className="absolute bottom-16 left-0 z-10 shadow-xl rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Picker
                    onEmojiClick={onEmojiClick}
                    pickerStyle={{
                      width: "100%",
                      backgroundColor: "#fff",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </motion.div>
              )}

              <textarea
                className="w-full h-12 max-h-32 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
              />
            </div>

            <motion.button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className={`p-3 rounded-full ${
                messageInput.trim()
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              whileHover={messageInput.trim() ? { scale: 1.05 } : {}}
              whileTap={messageInput.trim() ? { scale: 0.95 } : {}}
            >
              <FiSend size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
