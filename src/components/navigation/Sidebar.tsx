import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

import {
  GraduationCap, User, HelpCircle, LogOut, LayoutGrid, Folder, 
  BookMarked, Users, Briefcase, Award, Sparkles, Bell, ShieldCheck,
  History as HistoryIcon 
} from 'lucide-react';

interface Notification {
    id: string;
    message: string;
    link: string;
    is_read: boolean;
    created_at: string;
}

const NotificationDropdown: React.FC<{ notifications: Notification[]; onClose: () => void }> = ({ notifications, onClose }) => {
    const navigate = useNavigate();

    const handleNotificationClick = (link: string) => { navigate(link); onClose(); };
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    useEffect(() => {
        const handleClickOutside = () => onClose();
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 bottom-full mb-2 w-72 bg-white rounded-lg shadow-2xl border z-20"
            onClick={stopPropagation}
        >
            <div className="p-3 font-bold text-sm text-slate-700 border-b">Notifikasi</div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} onClick={() => handleNotificationClick(notif.link)} className={`p-3 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50 ${!notif.is_read ? 'bg-teal-50/50' : ''}`}>
                            <p className="text-sm text-slate-800">{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-sm text-slate-500">Tidak ada notifikasi baru.</div>
                )}
            </div>
        </motion.div>
    );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; isActive: boolean; isSidebarOpen: boolean }> = ({ to, icon, label, isActive, isSidebarOpen }) => {
  return (
    <Link to={to} title={label} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-teal-100 text-teal-800' : 'text-slate-600 hover:bg-slate-100'} ${!isSidebarOpen && 'justify-center'}`}>
      <div className={`${isActive ? 'text-teal-600' : 'text-slate-500'}`}>{icon}</div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.span 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="font-medium whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};

const Sidebar: React.FC<{ role: 'student' | 'lecturer' | 'prodi' | 'industry' | 'admin'; isOpen: boolean }> = ({ role, isOpen }) => {
    const location = useLocation();
    const { logout, currentUser } = useAuth();
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    // [PERBAIKAN 1] - Mengaktifkan fetch notifikasi untuk Dosen juga
    useEffect(() => {
        // Logika ini sekarang berlaku untuk mahasiswa DAN dosen
        if (currentUser?.role === 'student' || currentUser?.role === 'lecturer') {
            const fetchNotifications = async () => {
                try {
                    const response = await api.get('/notifications');
                    setNotifications(response.data);
                } catch (error) { console.error("Gagal mengambil notifikasi", error); }
            };
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    const handleNotifToggle = async () => {
        const shouldOpen = !isNotifOpen;
        setIsNotifOpen(shouldOpen);
        if (shouldOpen && unreadCount > 0) {
            try {
                await api.post('/notifications/mark-read');
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            } catch (error) { console.error("Gagal menandai notifikasi", error); }
        }
    };

    const getNavItems = () => {
        const commonProfile = { to: `/${role}/profile`, icon: <User size={20} />, label: 'Profil' };
        
        switch (role) {
            case 'student': return [
              { to: '/student', icon: <LayoutGrid size={20} />, label: 'Dashboard' },
              { to: '/student/kelola-sertifikasi', icon: <Award size={20} />, label: 'Sertifikasi' },
              { to: '/student/kelola-proyek', icon: <Folder size={20} />, label: 'Proyek' },
              { to: '/student/kolaborasi', icon: <Briefcase size={20} />, label: 'Kolaborasi' },
              commonProfile,
            ];
            case 'lecturer': return [
              { to: '/lecturer', icon: <LayoutGrid size={20} />, label: 'Dashboard' },
              { to: '/lecturer/kolaborasi', icon: <Briefcase size={20} />, label: 'Kolaborasi' },
              commonProfile,
            ];
            case 'prodi': return [
              { to: '/prodi', icon: <LayoutGrid size={20} />, label: 'Dashboard' },
              { to: '/prodi/pemetaan-keahlian', icon: <Sparkles size={20} />, label: 'Pemetaan Keahlian' },
              commonProfile,
            ];
            case 'industry': return [
              { to: '/industry', icon: <Users size={20} />, label: 'Cari Talenta' },
              { to: '/industry/collaboration-history', icon: <HistoryIcon size={20} />, label: 'Riwayat Ajakan' },
              commonProfile,
            ];
            case 'admin': return [
              { to: '/admin', icon: <ShieldCheck size={20} />, label: 'Dashboard' },
              { to: '/admin/kelola-pengguna', icon: <Users size={20} />, label: 'Kelola Pengguna' },
              commonProfile,
            ];
            default: return [commonProfile];
        }
    };
    
    const sidebarVariants = {
        open: { width: '16rem', transition: { type: 'spring', stiffness: 300, damping: 30 }},
        closed: { width: '4rem', transition: { type: 'spring', stiffness: 300, damping: 30 }}
    };

    return (
        <motion.div
            variants={sidebarVariants}
            animate={isOpen ? 'open' : 'closed'}
            className="bg-white border-r border-slate-200 flex flex-col h-screen fixed sm:relative z-50"
        >
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-slate-200 h-16">
                <GraduationCap size={28} className="text-teal-600 flex-shrink-0" />
                <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}>
                        <h1 className="text-xl font-bold text-slate-800 whitespace-nowrap">E-Portfolio</h1>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* User Info */}
            <div key={currentUser?.email} className={`p-4 border-b border-slate-200 ${!isOpen && 'py-3'}`}>
                <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
                    <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=0D9488&color=fff`} alt="User" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <AnimatePresence>
                    {isOpen && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}} className="overflow-hidden">
                        <div className="font-semibold text-slate-800 whitespace-nowrap">{currentUser?.name || 'User'}</div>
                        <div className="text-xs text-slate-500 whitespace-nowrap">{currentUser?.email || 'email@example.com'}</div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-1">
                    {getNavItems().map((item) => (
                        <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} isActive={location.pathname === item.to} isSidebarOpen={isOpen} />
                    ))}
                </div>
            </nav>
            
            {/* Bottom Buttons */}
            <div className="p-4 border-t border-slate-200 space-y-1">
                {/* [PERBAIKAN 2] - Menampilkan tombol notifikasi untuk Dosen juga */}
                {(currentUser?.role === 'student' || currentUser?.role === 'lecturer') && (
                    <div className="relative">
                        <button onClick={handleNotifToggle} title="Notifikasi" className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 text-slate-600 hover:bg-slate-100 ${!isOpen && 'justify-center'}`}>
                            <div className="relative">
                                <Bell size={20} className="text-slate-500" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{unreadCount}</span>
                                )}
                            </div>
                            {isOpen && <span className="font-medium whitespace-nowrap">Notifikasi</span>}
                        </button>
                        <AnimatePresence>{isNotifOpen && isOpen && <NotificationDropdown notifications={notifications} onClose={() => setIsNotifOpen(false)} />}</AnimatePresence>
                    </div>
                )}
                <NavItem to="/help" icon={<HelpCircle size={20} />} label="Bantuan" isActive={false} isSidebarOpen={isOpen}/>
                <button onClick={logout} title="Logout" className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 text-slate-600 hover:bg-slate-100 ${!isOpen && 'justify-center'}`}>
                    <div className="text-slate-500"><LogOut size={20} /></div>
                    {isOpen && <span className="font-medium whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;