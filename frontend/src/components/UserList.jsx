import Avatar from "@mui/material/Avatar";

import { motion, AnimatePresence } from "framer-motion";
export const UserList = ({ users }) => {
  return (
    <div className="h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Online Users <span className="text-cyan-600">({users.length})</span>
      </h2>
      <ul className="space-y-3">
        <AnimatePresence>
          {users.map((user) => (
            <motion.li
              key={user}
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="font-medium text-gray-700">{user}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};
