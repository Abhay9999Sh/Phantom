/**
 * HYPER-BEAUTIFUL JARVIS ADMIN PANEL
 * * V2: Rebuilt with a "Dreamy" LIGHT THEME based on user feedback.
 * - Uses the light 'from-sky-50' gradient background.
 * - Adopts the bright color palette (primary, secondary, accent).
 * - Full-screen (h-screen) flex layout for "better space optimization".
 * - "Cooler" UI with glassmorphism, animated gradient text, and fluid animations.
 * - "Cooler" buttons with shimmer effects.
 * * Functionality is 100% identical.
 */

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Calendar,
  BrainCircuit,
  Info,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// --- Darkened Dreamy Video-Inspired Color Palette (from your example) ---
const colors = {
  primary: "#6495ED", // Brighter Blue
  secondary: "#E996AF", // Brighter Pink
  tertiary: "#A3A3CC", // Brighter Lavender
  accent: "#ed9252ff", // Brighter Orange/Peach
  text: "#2D3748", // Dark text for light background
  textLight: "#4A5568",
};

// --- Smooth Animation Variants (from your example) ---
const chatContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Messages appear one by one
    },
  },
};

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
      duration: 0.8,
    },
  },
};

export default function AdminPanel() {
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      message: "👋 Welcome to Jarvis! I'm your AI-powered campus assistant.\n\nTry commands like:\n• 'show events in next 3 months'\n• 'create Hackathon on 15 Dec 2025 at 9 AM in Main Hall'\n• 'events before 2026'\n• 'delete event name'\n• 'update event time to 5 PM'",
      timestamp: new Date(),
      success: true,
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null); // This ref is now used

  const quickCommands = [
    { text: "Create AI workshop tomorrow at 3 PM in Lab 204" },
    { text: "Mark Dr. Smith absent for today" },
    { text: "Notify all students about library closure" },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Focus input when a quick command is clicked
  const useQuickCommand = (command) => {
    setCurrentMessage(command);
    inputRef.current?.focus();
  };
  
  // --- FUNCTIONALITY UNCHANGED ---
  const handleSend = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');

    const newUserMessage = {
      role: 'user',
      message: userMessage,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      const botMessage = {
        role: 'assistant',
        message: data.reply || data.error || 'Sorry, something went wrong.',
        timestamp: new Date(),
        functionCalled: data.functionCalled, 
        success: response.ok && !data.error, 
      };
      setChatHistory((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        message: '❌ Failed to connect to Jarvis. Please check your connection and try again.',
        timestamp: new Date(),
        success: false,
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  // --- END OF UNCHANGED FUNCTIONALITY ---

  return (
    <>
      <Head>
        <title>Jarvis - AI Campus Assistant</title>
        <meta name="description" content="Beautiful AI-powered campus management" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      {/* NEW LAYOUT: Full-screen, flex-col.
        NEW THEME: Light gradient background from inspiration.
      */}
      <div 
        className="h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50" 
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        
        {/* Animated background blobs (subtler for light theme) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.primary}20` }} // 20% opacity
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.secondary}20` }} // 20% opacity
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* NEW HEADER: Glassmorphism (light) + Animated Gradient Text
        */}
        <motion.header
          className="relative bg-white/30 backdrop-blur-xl border-b border-white/50 shadow-lg z-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1.5 rounded-2xl blur-lg"
                    style={{
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                    animate={{ opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}>
                    <BrainCircuit className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <div>
                  {/* ANIMATED GRADIENT TEXT FROM INSPIRATION */}
                  <motion.h1
                    className="text-2xl md:text-3xl font-black"
                    style={{
                      backgroundImage: `linear-gradient(45deg, ${colors.primaryDark}, ${colors.secondaryDark}, ${colors.tertiaryDark})`,
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-transparent bg-clip-text">Jarvis AI</span>
                  </motion.h1>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>
                    Smart Campus Assistant
                  </p>
                </div>
              </motion.div>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-white/40 hover:bg-white/70 backdrop-blur-lg rounded-xl font-medium transition-all border border-white/50 text-sm md:text-base"
                style={{ color: colors.text }}
              >
                Dashboard
              </motion.a>
            </div>
          </div>
        </motion.header>

        {/* NEW CHAT AREA: Flex-1 for full height, fluid animations
        */}
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
          variants={chatContainerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                variants={messageVariants}
                layout
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${
                    msg.role === 'user'
                      ? 'text-white'
                      : 'bg-white/60 backdrop-blur-md border border-gray-200 text-gray-800'
                  }`}
                  style={msg.role === 'user' ? {
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                  } : {}}
                >
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  
                  <div className={`flex items-center justify-between mt-2 text-xs ${msg.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                    <span>
                      {msg.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {msg.role === 'assistant' && (
                      <span className={`flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full text-xs ${
                        msg.success === false
                          ? 'bg-red-500/10 text-red-700'
                          : 'bg-green-500/10 text-green-700'
                      }`}>
                        {msg.success === false ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          msg.functionCalled && <CheckCircle className="w-3 h-3" />
                        )}
                        {msg.functionCalled ? msg.functionCalled : (msg.success === false ? 'Error' : 'Ready')}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </motion.main>

        {/* NEW INPUT AREA: Glassmorphism (light) + "Cool" Accent Button
        */}
        <motion.footer 
          className="relative bg-white/30 backdrop-blur-xl border-t border-white/50 p-4 z-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.2 }}
        >
          {/* Quick Command "Pills" */}
          <motion.div className="mb-3 flex flex-wrap gap-2">
            {quickCommands.map((cmd, index) => (
              <motion.button
                key={index}
                onClick={() => useQuickCommand(cmd.text)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50 transition-colors hover:bg-white/70"
                style={{ color: colors.textLight }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="text-sm font-medium">{cmd.text}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Main Input */}
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your command... (e.g., 'Create an AI workshop tomorrow...')"
              className="flex-1 bg-white/70 text-gray-800 placeholder-gray-500 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: colors.primary }}
              disabled={isLoading}
            />
            {/* "COOL" BUTTON: Bright accent color + shimmer */}
            <motion.button
              onClick={handleSend}
              disabled={isLoading || !currentMessage.trim()}
              className="relative px-6 py-3 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              style={{
                background: `linear-gradient(45deg, ${colors.accent}, #F472B6)`, // Accent to Pink
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
                {isLoading ? 'Sending' : 'Send'}
              </span>
            </motion.button>
          </div>
        </motion.footer>
      </div>

      {/* Keep the bounce animation for the loader */}
      <style jsx>{`
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-0.5rem);
          }
        }
      `}</style>
    </>
  );
}