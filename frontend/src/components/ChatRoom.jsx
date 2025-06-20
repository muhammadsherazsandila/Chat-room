import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import Message from "./Message";
import UserList from "./UserList";
import { Button, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";

const socket = io("http://localhost:3001");

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;

    socket.emit("join", username);

    socket.on("user-connected", (name) => toast.success(`${name} connected!`));
    socket.on("user-disconnected", (name) =>
      toast.error(`${name} disconnected!`)
    );
    socket.on("new-message", (message) =>
      setMessages((prev) => [...prev, message])
    );
    socket.on("user-list", setUsers);
    socket.on("init-data", ({ messages, users }) => {
      setMessages(messages);
      setUsers(users);
    });

    return () => {
      socket.disconnect(); // Clean disconnection
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    socket.emit("send-message", {
      text: messageInput,
      replyTo: replyingTo?.id || null,
    });

    setMessageInput("");
    setReplyingTo(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/4 bg-white p-4 border-r">
        <UserList users={users} />
      </aside>

      <main className="flex flex-col w-3/4">
        <section className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              onReply={setReplyingTo}
              isCurrentUser={msg.username === username}
              messages={messages}
            />
          ))}
          <div ref={messagesEndRef} />
        </section>

        <footer className="bg-white p-4 border-t">
          {replyingTo && (
            <div className="flex items-center justify-between mb-2 bg-blue-100 p-2 rounded">
              <p className="text-sm text-gray-700">
                Replying to: {replyingTo.text}
              </p>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-600 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <TextField
              multiline
              maxRows={4}
              fullWidth
              variant="outlined"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              endIcon={<Send />}
            >
              Send
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
