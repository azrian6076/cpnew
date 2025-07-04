// GANTI SELURUH FILE INI

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/navigation/Sidebar'; // Pastikan path ini benar
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  role: 'student' | 'lecturer' | 'prodi' | 'industry' | 'admin';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { currentUser, token } = useAuth();
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  // --- STATE BARU UNTUK SIDEBAR ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- LOGIKA PENJAGAAN RUTE (SUDAH BAGUS, KITA PERTAHANKAN) ---
  useEffect(() => {
    // Jika tidak terotentikasi, paksa kembali ke login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Jika role pengguna tidak sesuai dengan role halaman, arahkan ke dashboard mereka yang benar
    if (currentUser?.role !== role) {
      // Tambahkan pengecekan untuk memastikan currentUser ada sebelum navigasi
      if (currentUser?.role) {
        navigate(`/${currentUser.role}`);
      } else {
        // Fallback jika role tidak ada, mungkin kembali ke login
        navigate('/login');
      }
    }
  }, [isAuthenticated, currentUser, navigate, role]);

  // Tampilkan null (atau loading spinner) selagi pengecekan berlangsung
  if (!isAuthenticated || !currentUser) {
    return null; 
  }

  // Render layout hanya jika otentikasi dan otorisasi berhasil
  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* 1. Komponen Sidebar sekarang menerima prop 'isOpen' */}
      <Sidebar role={role} isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 2. Header sekarang berisi tombol untuk mengubah state sidebar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4 h-16">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="font-semibold text-slate-700">
              Selamat datang kembali, {currentUser.name}!
            </div>
          </div>
        </header>

        {/* 3. Konten Utama */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-4 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;