import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { format } from "date-fns";

export default function Message({ message, onReply, isCurrentUser, messages }) {
  const [showReplyHint, setShowReplyHint] = useState(false);

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "";

  const originalMessage = messages?.find((m) => m.id === message.replyTo);

  return (
    <div
      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      onDoubleClick={() => onReply(message)}
    >
      {!isCurrentUser && (
        <Avatar className="mr-2 bg-blue-500 text-white">
          {getInitial(message.username)}
        </Avatar>
      )}

      <div
        className={`max-w-xs lg:max-w-md p-3 rounded-lg relative shadow
          ${isCurrentUser ? "bg-blue-600 text-white" : "bg-white border"}`}
        onMouseEnter={() => setShowReplyHint(true)}
        onMouseLeave={() => setShowReplyHint(false)}
      >
        {message.replyTo && (
          <div
            className={`mb-2 p-2 rounded text-sm italic opacity-80
            ${isCurrentUser ? "bg-blue-700" : "bg-gray-100 text-gray-700"}`}
          >
            {originalMessage?.text || "Original message"}
          </div>
        )}

        <div className="flex justify-between items-center mb-1">
          {!isCurrentUser && (
            <span className="font-semibold">{message.username}</span>
          )}
          <span className="text-xs opacity-70">
            {format(new Date(message.timestamp), "HH:mm")}
          </span>
        </div>

        <p className="break-words">{message.text}</p>

        {showReplyHint && (
          <div
            className={`absolute text-xs px-2 py-1 rounded -bottom-6
            ${
              isCurrentUser
                ? "right-0 bg-blue-200 text-blue-800"
                : "left-0 bg-gray-200 text-gray-800"
            }`}
          >
            Double click to reply
          </div>
        )}
      </div>
    </div>
  );
}
