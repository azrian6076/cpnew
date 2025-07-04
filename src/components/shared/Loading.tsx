import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div 
        className="h-16 w-16 mb-4 flex items-center justify-center"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="h-full w-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full" />
      </motion.div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;