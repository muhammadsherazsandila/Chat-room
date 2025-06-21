import React from "react";
import { motion } from "framer-motion";
import { FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Header() {
  return (
    <>
      {/* Header */}
      <motion.header
        className="relative py-6 px-4 sm:px-8 flex justify-between items-center  z-10 bg-transparent backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <FaComments className="text-3xl text-blue-900" />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-500">
              ROOMIFY
            </span>
          </motion.h1>
        </motion.div>
      </motion.header>
    </>
  );
}

export default Header;
