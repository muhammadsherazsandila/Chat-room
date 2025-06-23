import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { formattedDate, getInitial } from "../utils/formaters";

export const Message = ({ message, onReply, isCurrentUser }) => {
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

      <div className="  ">
        {!isCurrentUser && (
          <div className="text-xs font-semibold text-gray-400 mb-1 px-1">
            {message.sender.username}
          </div>
        )}

        {message.replyTo && (
          <div className="bg-gray-700 px-3 py-2 rounded-tl-lg rounded-tr-lg -mb-2 text-sm truncate ml-2">
            <p className="text-xs truncate text-gray-200 mb-2">
              {message.replyTo.length > 20
                ? message.replyTo.slice(0, 20) + "..."
                : message.replyTo}
            </p>
          </div>
        )}
        <div
          className={`relative rounded-2x p-2 shadow-md transition-all bg-gray-800 text-gray-200 rounded-lg `}
        >
          <p className="text-sm break-words mb-2">{message.text}</p>

          <div className="text-right text-xs w-full">
            {formattedDate(message)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
