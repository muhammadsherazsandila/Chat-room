import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export const Message = ({
  message,
  onReply,
  isCurrentUser,
  replyToMessage,
}) => {
  const [showReplyHint, setShowReplyHint] = useState(false);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const formattedDate = format(new Date(message.timestamp), "HH:mm");
  let hours = formattedDate.split(":")[0];
  let minutes = formattedDate.split(":")[1];
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours > 12 ? hours - 12 : hours;
  return (
    <motion.div
      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onDoubleClick={() => onReply(message)}
      onMouseEnter={() => setShowReplyHint(true)}
      onMouseLeave={() => setShowReplyHint(false)}
    >
      {!isCurrentUser && (
        <div className="mr-2 self-end">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">
              {getInitial(message.username)}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-xs md:max-w-md">
        {!isCurrentUser && (
          <div className="text-sm font-medium text-cyan-600 mb-1">
            {message.username}
          </div>
        )}

        <div
          className={`p-4 rounded-2xl ${
            isCurrentUser
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
        >
          {message.replyTo && replyToMessage && (
            <div
              className={`mb-2 p-2 rounded-lg border-l-4 ${
                isCurrentUser
                  ? "border-cyan-300 bg-cyan-500/20"
                  : "border-gray-400 bg-gray-200"
              }`}
            >
              <p className="text-xs font-medium truncate">
                {replyToMessage.username}
              </p>
              <p className="text-xs truncate">{replyToMessage.text}</p>
            </div>
          )}

          <p>{message.text}</p>

          <div className="flex justify-end mt-2">
            <span className="text-xs opacity-80">
              {hours + ":" + minutes + " " + amPm}
            </span>
          </div>
        </div>

        {showReplyHint && (
          <motion.div
            className={`text-xs mt-1 px-2 py-1 rounded-full ${
              isCurrentUser
                ? "bg-cyan-100 text-cyan-800"
                : "bg-gray-200 text-gray-800"
            }`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Double click to reply
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
