import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiSmile, FiX } from "react-icons/fi";
import { UserList } from "./UserList.jsx";
import { Message } from "./Message.jsx";

import useSound from "use-sound";
import { getInitial } from "../utils/formaters.js";
import TypingIndicator from "./TypingIndicator.jsx";

const socket = io("https://roomify.up.railway.app/", {
  transports: ["websocket"],
});

export default function ChatRoom() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem("username") || "Anonymous";
  const [typing, setTyping] = useState(false);
  const [typer, setTyper] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [playToMsgSent] = useSound("/sounds/msgSent.mp3", {
    volume: 1,
    interrupt: true,
    onplay: () => {
      console.log("playing sent sound");
    },
  });

  const [playToMsgReceived] = useSound("/sounds/msgReceived.mp3", {
    volume: 1,
    interrupt: true,
    onplay: () => {
      console.log("playing received sound");
    },
  });

  const [playToTyping] = useSound("/sounds/typing.mp3", {
    volume: 1,
    interrupt: true,
    onplay: () => {
      console.log("playing typing sound");
    },
  });
  // Initialize socket connection
  useEffect(() => {
    if (!username) return;

    socket.emit("join", username);

    socket.on("user-connected", (username, data) => {
      toast.success(`${username} connected!`, {
        icon: "👋",
        style: {
          background: "#4ade80",
          color: "#fff",
        },
      });

      setMessages(data.messages);
      setUsers(data.users);
      setOnlineUsers(data.onlineUsers);
    });

    socket.on("user-disconnected", (username, onlineUsers) => {
      toast.error(`${username} disconnected!`, {
        icon: "👋",
        style: {
          background: "#f87171",
          color: "#fff",
        },
      });

      setOnlineUsers(onlineUsers);
    });

    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.sender.username !== username) playToMsgReceived();
    });

    socket.on("user-list", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.disconnect();
    };
  }, [username && socket]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle typing
  const handleMessageTyping = (e) => {
    setMessageInput(e.target.value);
    if (messageInput.length < 1) {
      setTyping(true);
      socket.emit("typing", username);
    }
  };

  useEffect(() => {
    socket.on("typing", (typer) => {
      setTyping(true);
      setTyper(typer);
      if (typer.username !== username) playToTyping();
    });

    socket.on("stop-typing", () => {
      setTyping(false);
      setTyper(null);
    });
  }, [socket]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (!messageInput) {
      toast.error("Please enter a message");
    }
    if (messageInput.trim()) {
      socket.emit("send-message", {
        text: messageInput,
        sender: username,
        replyTo: replyingTo || null,
      });
      setMessageInput("");
      setReplyingTo(null);
      playToMsgSent();
    } else {
      toast.error("Please enter a message");
    }
    socket.emit("stop-typing", username);
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Find reply message
  const getReplyMessage = (replyId) => {
    return messages.find((msg) => msg._id === replyId);
  };

  const handleReply = (messageId) => {
    const replyMessage = getReplyMessage(messageId);
    if (!replyMessage) return;
    setReplyingTo(replyMessage.text);
    return replyMessage;
  };

  const handleLeaveChat = () => {
    socket.emit("leave", username);
    let newOnlineUsers = onlineUsers.filter(
      (user) => user.username !== username
    );
    setOnlineUsers(newOnlineUsers);
    navigate("/");
  };

  return (
    <>
      <div className="flex w-full h-screen bg-gradient-to-br overflow-y-auto from-gray-900 to-gray-950 text-white">
        <span
          className="hidden md:block absolute top-4 right-8 z-50 text-sm bg-gradient-to-br from-gray-900 to-blue-900 px-5 py-2  w-20 rounded-full cursor-pointer hover:scale-110 transition-all duration-200 ease-in-out hover:bg-gradient-to-tr hover:from-gray-900 hover:to-blue-900 text-center"
          onClick={handleLeaveChat}
        >
          Leave
        </span>
        {/* Sidebar - User List */}
        <div className="w-full md:w-80 bg-white p-6 shadow-lg hidden md:block bg-gradient-to-br from-gray-900 to-gray-950 text-white">
          <UserList users={onlineUsers} />
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1">
          {/* Mobile Header */}
          <div className="w-full fixed top-0 left-0 z-50 shadow-xl md:hidden bg-transparent border-b-gray-400  text-gray-200 p-4  flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full mr-2"
                src="/images/logo.jpeg"
                alt="logo"
              />
              <h1 className="text-xl font-bold">Roomify</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className="text-sm bg-gradient-to-br from-gray-900 to-blue-900 px-5 py-2  rounded-full cursor-pointer hover:scale-110 transition-all duration-200 ease-in-out hover:bg-gradient-to-tr hover:from-gray-900 hover:to-blue-900 text-center"
                onClick={handleLeaveChat}
              >
                Leave
              </span>
              <span
                className="flex justify-center items-center text-sm bg-gradient-to-br from-gray-900 to-blue-900 px-5 py-2 h-10 rounded-full "
                onClick={() => setShowUserList(!showUserList)}
              >
                <div className="mr-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                {onlineUsers.length} online
              </span>
            </div>
          </div>

          {/* Mobile User List */}
          <div
            className={`w-full fixed left-0 z-50 shadow-xl md:hidden bg-gradient-to-br from-gray-900 to-blue-900 p-4 transition-all duration-300 ease-in-out ${
              showUserList ? "top-16" : "top-[-100%]"
            }`}
          >
            <UserList users={onlineUsers} />
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto py-4 sm:p-4 md:p-6 relative">
            <AnimatePresence>
              {messages.map((msg) => (
                <Message
                  key={msg._id}
                  message={msg}
                  onReply={handleReply}
                  isCurrentUser={msg.sender.username === username}
                />
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
          {/* Typing Indicator */}
          {typing && typer?.username !== username && (
            <div className="flex items-center bg-transparent p-3 rounded-tr-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {getInitial(typer?.username)}
                </span>
              </div>
              <div>
                <h4 className="font-semibold ">{typer?.username}</h4>
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 shadow-md relative bg-gradient-to-br from-gray-900 to-gray-950 text-gray-200">
            {/* Reply Preview */}
            {replyingTo && (
              <div className="flex items-center justify-between mb-3 bg-transparent p-3 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs font-medium text-cyan-700">
                    Replying to:
                  </p>
                  <p className="text-sm truncate">
                    {replyingTo.length > 20
                      ? `${replyingTo.substring(0, 20)}...`
                      : replyingTo}
                  </p>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-cyan-700 hover:text-cyan-900 p-1"
                >
                  <FiX size={18} />
                </button>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <textarea
                  className="w-full h-12 max-h-32 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none bg-transparent overflow-y-scroll scrollbar-hide"
                  value={messageInput}
                  onChange={(e) => handleMessageTyping(e)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                  style={{ overflowY: "scroll", scrollbarWidth: "none" }}
                />
              </div>

              <motion.button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={` flex items-center justify-center w-10 h-10  bg-gradient-to-r from-gray-900 to-blue-900 rounded-full`}
                whileHover={messageInput.trim() ? { scale: 1.05 } : {}}
                whileTap={messageInput.trim() ? { scale: 0.95 } : {}}
              >
                <FiSend size={18} className=" animate-bounce" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-500/10"
            style={{
              width: Math.floor(Math.random() * 30) + 10,
              height: Math.floor(Math.random() * 30) + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </>
  );
}
