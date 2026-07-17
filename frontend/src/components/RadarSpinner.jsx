import React from 'react';
import { motion } from 'framer-motion';

const RadarSpinner = () => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 border-2 border-indigo-500 rounded-full opacity-20"
        animate={{ scale: [1, 2], opacity: [0.8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 border-2 border-indigo-400 rounded-full opacity-40"
        animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeOut" }}
      />
      <div className="w-12 h-12 bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.8)] z-10 flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default RadarSpinner;
