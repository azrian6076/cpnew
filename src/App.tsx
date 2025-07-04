import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { StudentDataProvider } from './contexts/StudentDataContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// General Pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './components/shared/Profile';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import KelolaSertifikasi from './pages/student/kelolasertifikasi';
import KelolaProyek from './pages/student/kelolaproyek';
import EditProfil from './pages/student/EditProfil';
import CollaborationDetail from './pages/student/CollaborationDetail';

// Lecturer Pages
import LecturerDashboard from './pages/lecturer/Dashboard'; // <-- KITA AKAN GUNAKAN INI
import StudentPortfolioDetail from './pages/lecturer/StudentPortfolioDetail';
import Kolaborasi from './pages/lecturer/kolaborasi';
import PortfolioPage from './pages/lecturer/portofolio';

// Prodi Pages
// import ProdiDashboard from './pages/prodi/Dashboard'; // <-- [1] HAPUS BARIS INI

// Industry Pages
import IndustryDashboard from './pages/industry/Dashboard';
import RequestCollaboration from './pages/industry/RequestCollaboration';
import FormKolaborasi from './pages/industry/FormKolaborasi';



// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';


function App() {
  return (
    <AuthProvider>
      <StudentDataProvider>
        <Routes>
          {/* Rute Otentikasi */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />

          {/* Rute Mahasiswa */}
          <Route path="/student" element={<DashboardLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="kelola-sertifikasi" element={<KelolaSertifikasi />} />
            <Route path="edit-profil" element={<EditProfil />} />
            <Route path="kelola-proyek" element={<KelolaProyek />} />
            <Route path="kolaborasi/:collaborationId" element={<CollaborationDetail />} />
          </Route>

          {/* Rute Dosen */}
          <Route path="/lecturer" element={<DashboardLayout role="lecturer" />}>
            <Route index element={<LecturerDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="kolaborasi" element={<Kolaborasi />} />
            <Route path="portofolio/:userId" element={<StudentPortfolioDetail />} /> 
          </Route>

          {/* Rute Prodi */}
          <Route path="/prodi" element={<DashboardLayout role="prodi" />}>
              <Route path="portofolio/:userId" element={<StudentPortfolioDetail />} />
            <Route index element={<LecturerDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="kolaborasi" element={<Kolaborasi />} />
            <Route path="portofolio/:userId" element={<StudentPortfolioDetail />} />
          </Route>

      {/* Rute Industri */}
<Route path="/industry" element={<DashboardLayout role="industry" />}>
    {/* Halaman utama (dashboard) untuk /industry */}
    <Route index element={<IndustryDashboard />} />
    
    {/* Halaman riwayat kolaborasi */}
   
    
    {/* Halaman form untuk mengajukan kolaborasi */}
    <Route path="request-collaboration" element={<RequestCollaboration />} /> 
    
    {/* Halaman profil pengguna industri */}
    <Route path="profile" element={<Profile />} />
    
    {/* Halaman untuk melihat detail portfolio mahasiswa */}
    <Route path="portofolio/:userId" element={<StudentPortfolioDetail />} />
     <Route path="kolaborasi/ajukan" element={<FormKolaborasi />} />
</Route>

          {/* Rute Admin */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Halaman tidak ditemukan */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </StudentDataProvider>
    </AuthProvider>
  );
}

export default App;