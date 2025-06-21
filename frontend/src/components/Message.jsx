import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect } from "react";

export const Message = ({
  message,
  onReply,
  isCurrentUser,
  replyToMessage,
}) => {
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  const formattedDate = format(new Date(message.createdAt), "hh:mm a");

  return (
    <motion.div
      className={`flex mb-3 px-4 z-50 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onDoubleClick={() => onReply(message._id)}
    >
      {!isCurrentUser && (
        <div className="mr-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">
              {getInitial(message.sender.username)}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-[75%] ">
        {!isCurrentUser && (
          <div className="text-xs font-semibold text-gray-400 mb-1 px-1">
            {message.sender.username}
          </div>
        )}

        <div
          className={`relative rounded-2x p-2 shadow-md transition-all bg-gray-800 text-gray-200 rounded-bl-lg rounded-tr-lg`}
        >
          {message.replyTo && (
            <div
              className={`mb-2 px-3 py-2 rounded-xl text-sm truncate border-l-4 ${
                isCurrentUser ? " border-blue-900" : " border-gray-400"
              }`}
            >
              <p className="text-xs font-bold truncate text-gray-200">
                Replying to
              </p>
              <p className="text-xs truncate text-gray-200">
                {message.replyTo}
              </p>
            </div>
          )}

          <p className="text-sm break-words mb-2">{message.text}</p>

          <div
            className={`absolute right-2 text-[10px]  w-full max-w-2xl text-right bottom-1`}
          >
            {formattedDate}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
