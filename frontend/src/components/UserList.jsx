import Avatar from "@mui/material/Avatar";

import { motion, AnimatePresence } from "framer-motion";
export const UserList = ({ users }) => {
  return (
    <div className="h-full ">
      <h2 className="text-xl font-bold mb-4 text-white">
        Online Users <span className="text-white">({users.length})</span>
      </h2>
      <ul className="space-y-3">
        <AnimatePresence>
          {users.map((user) => (
            <motion.li
              key={user._id}
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-900 to-blue-900 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="font-medium text-gray-400">{user.username}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};
