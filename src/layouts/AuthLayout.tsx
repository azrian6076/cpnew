import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 flex flex-col justify-center items-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <GraduationCap size={40} className="text-teal-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white text-center mb-2">E-Portfolio System</h1>
        <p className="text-white text-center mb-8">Manage your academic and professional journey</p>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;