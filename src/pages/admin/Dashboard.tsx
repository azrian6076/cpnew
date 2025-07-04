import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import DashboardSection from '../../components/dashboard/DashboardSection';
import { Users, Building2, Settings, Activity, Shield, Database } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="h-full">
      {/* Welcome Banner */}
      <motion.div
        className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">Selamat Datang di Sistem E-Portfolio</h1>
        <p className="opacity-90">
          Halo, {user?.name || 'Administrator'}! Kelola sistem e-portfolio dan pantau semua aktivitas platform dari sini.
        </p>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Users"
            value="1,250"
            icon={<Users className="text-blue-500" />}
            change="+48"
            trend="up"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Departments"
            value="12"
            icon={<Building2 className="text-purple-500" />}
            change="+1"
            trend="up"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Active Sessions"
            value="85"
            icon={<Activity className="text-green-500" />}
            change="+23"
            trend="up"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="System Status"
            value="Stable"
            icon={<Shield className="text-teal-500" />}
            change="100%"
            trend="neutral"
          />
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DashboardSection title="Recent System Activity" icon={<Activity size={18} />}>
            <div className="space-y-3">
              {[
                { action: 'User Login', details: 'Ahmad Rahman (Student)', time: '5 minutes ago', ip: '192.168.1.45' },
                { action: 'User Registration', details: 'Novi Anggraini (Lecturer)', time: '1 hour ago', ip: '192.168.1.67' },
                { action: 'Password Reset', details: 'Budi Santoso (Student)', time: '2 hours ago', ip: '192.168.1.32' },
                { action: 'Profile Update', details: 'Dr. Hadi Wijaya (Lecturer)', time: '3 hours ago', ip: '192.168.1.89' },
                { action: 'System Backup', details: 'Automatic Backup', time: '6 hours ago', ip: 'System' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">{activity.action}</h4>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-0.5">IP: {activity.ip}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </motion.div>
        
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DashboardSection title="System Health" icon={<Shield size={18} />}>
            <div className="space-y-4">
              {[
                { name: 'Server Uptime', value: '99.9%', status: 'Excellent', color: 'bg-green-500' },
                { name: 'Database', value: '85% Usage', status: 'Good', color: 'bg-blue-500' },
                { name: 'API Response', value: '120ms', status: 'Good', color: 'bg-blue-500' },
                { name: 'Storage', value: '65% Used', status: 'Warning', color: 'bg-amber-500' },
                { name: 'Backup Status', value: 'Up to date', status: 'Excellent', color: 'bg-green-500' },
              ].map((metric, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${metric.color} mr-2`}></div>
                      <span className="font-medium text-gray-800">{metric.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      metric.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                      metric.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{metric.value}</p>
                </div>
              ))}
            </div>
          </DashboardSection>
        </motion.div>
      </div>
      
      {/* User Statistics */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <DashboardSection title="User Statistics" icon={<Database size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'Students', count: 850, active: '78%', color: 'border-blue-500' },
              { role: 'Lecturers', count: 125, active: '85%', color: 'border-green-500' },
              { role: 'Program Admins', count: 24, active: '92%', color: 'border-purple-500' },
              { role: 'Industry Partners', count: 35, active: '65%', color: 'border-amber-500' },
              { role: 'System Admins', count: 5, active: '100%', color: 'border-red-500' },
              { role: 'Guest Accounts', count: 211, active: '45%', color: 'border-gray-500' },
            ].map((stat, index) => (
              <div key={index} className={`bg-white p-4 rounded-lg border-l-4 ${stat.color} shadow-sm hover:shadow-md transition-shadow`}>
                <h4 className="font-medium text-gray-800">{stat.role}</h4>
                <div className="flex justify-between items-end mt-2">
                  <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
                  <div className="text-sm text-gray-600">{stat.active} active</div>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.color.replace('border', 'bg')}`}
                    style={{ width: stat.active }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View Detailed Reports
            </button>
          </div>
        </DashboardSection>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;