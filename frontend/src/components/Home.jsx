import React, { useState } from "react";
import {
  FaComments,
  FaUserFriends,
  FaLock,
  FaGoogle,
  FaGithub,
  FaRocket,
  FaLightbulb,
  FaBolt,
  FaRegSmile,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [activeTab, setActiveTab] = useState("join");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast.error("Please enter username and password");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 6 characters long");
    }

    axios
      .post("https://roomify.up.railway.app/user/join-chat", {
        username,
        password,
      })
      .then((res) => {
        if (res.data.status === "success") {
          setIsLoading(false);
          localStorage.setItem("username", username);
          navigate("/chat");
        } else {
          toast.error(res.data.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setIsLoading(false);
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    await axios
      .post("https://roomify.up.railway.app/user/register", {
        username,
        password,
      })
      .then((res) => {
        if (res.data.status === "success") {
          setIsLoading(false);
          localStorage.setItem("username", username);
          navigate("/chat");
        } else {
          toast.error(res.data.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setIsLoading(false);
      });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const cardHover = {
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <div className=" bg-gradient-to-br from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden z-0">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Connect & Chat in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Real-Time
              </span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Roomify brings people together with secure, modern chat rooms.
              Join the conversation today!
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex justify-center space-x-10 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: <FaUserFriends className="text-cyan-400 text-2xl" />,
                value: "10K+",
                label: "Active Users",
              },
              {
                icon: <FaLock className="text-green-400 text-2xl" />,
                value: "100%",
                label: "Secure Chats",
              },
              {
                icon: <FaBolt className="text-amber-400 text-2xl" />,
                value: "Instant",
                label: "Messaging",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                variants={itemVariants}
              >
                <div className="p-3 rounded-full bg-gray-800 backdrop-blur-sm">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-gray-300">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Auth Card */}
        <motion.div
          className="w-full max-w-md bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-10"></div>

          {/* Tabs */}
          <div className="flex mb-8 border-b border-gray-700">
            {["join", "Register"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 font-medium relative ${
                  activeTab === tab
                    ? "text-cyan-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "join" ? "Join Chat" : "Register"}
                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"
                    layoutId="tabIndicator"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Join Chat Form */}
          {activeTab === "join" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Username</label>
                <motion.input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                  placeholder="Enter username"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <div className="mb-8">
                <label className="block text-gray-300 mb-2">Password</label>
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <motion.button
                onClick={(e) => handleJoin(e)}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-medium flex justify-center items-center ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaRocket className="mr-2" /> Join Chat Room
                  </div>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Login Form */}
          {activeTab === "Register" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Username</label>
                <motion.input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                  placeholder="Username"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <div className="mb-8">
                <label className="block text-gray-300 mb-2">Password</label>
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600"
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <motion.button
                onClick={(e) => handleRegister(e)}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-medium mb-4 ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? "Registering..." : "Register"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.h3
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Roomify
            </span>
            ?
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaComments className="text-4xl mb-4 text-cyan-400" />,
                title: "Real-time Chat",
                description:
                  "Experience seamless conversations with instant message delivery and typing indicators.",
                color: "from-cyan-900/20 to-cyan-700/10",
              },
              {
                icon: <FaLock className="text-4xl mb-4 text-green-400" />,
                title: "End-to-End Encryption",
                description:
                  "Your conversations are secured with military-grade encryption technology.",
                color: "from-green-900/20 to-green-700/10",
              },
              {
                icon: (
                  <FaUserFriends className="text-4xl mb-4 text-purple-400" />
                ),
                title: "Group Rooms",
                description:
                  "Create or join chat rooms with friends, family, or colleagues.",
                color: "from-purple-900/20 to-purple-700/10",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm p-8 rounded-2xl border border-gray-700`}
                variants={cardHover}
                whileHover="hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {feature.icon}
                </motion.div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900/50 to-gray-950/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="inline-block p-2 rounded-full bg-gray-800 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
          >
            <FaRegSmile className="text-3xl text-amber-400" />
          </motion.div>

          <motion.h3
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Loved by Thousands
          </motion.h3>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xl italic text-gray-300 mb-6">
              "Roomify has transformed how our team communicates. The real-time
              features and security give us peace of mind while collaborating on
              projects."
            </p>
            <div className="flex items-center justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-4 text-left">
                <p className="font-bold">Alex Johnson</p>
                <p className="text-gray-400">Product Manager, TechCorp</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="inline-block p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-6"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <FaLightbulb className="text-3xl text-white" />
          </motion.div>

          <motion.h3
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h3>

          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of users who are already enjoying seamless
            communication with Roomify.
          </motion.p>

          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveTab("join")}
          >
            Join Roomify Now
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 relative z-10 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © {new Date().getFullYear()} Roomify Chat. All rights reserved.
          </motion.p>
          <motion.p
            className="mt-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Secure • Modern • Connected
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
