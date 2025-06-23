import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex items-end space-x-2 mt-2">
      <div className="bg-gray-200 px-4 py-2 rounded-2xl max-w-max shadow-md">
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
