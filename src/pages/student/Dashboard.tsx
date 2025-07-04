import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api'; 
import { Link } from 'react-router-dom'; 
import { 
    Award, Folder, UserCheck, BarChart3, ChevronRight, 
    Link as LinkIcon 
} from 'lucide-react';


interface PortofolioItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: 'Proyek' | 'Sertifikasi' | 'Organisasi';
  tautan?: string | null;
  created_at: string;
}

interface StatsData {
  sertifikat: number;
  proyek: number;
  organisasi: number;
}




// Komponen Header Bagian
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; children?: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="text-teal-500">{icon}</div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
    {children && <div className="mt-3 sm:mt-0">{children}</div>}
  </div>
);


const TabelDashboard: React.FC<{ data: PortofolioItem[]; type: 'prestasi' | 'proyek' }> = ({ data, type }) => {
    const columns = type === 'prestasi' 
        ? ['No', 'Judul Prestasi', 'Penyelenggara', 'Tanggal'] 
        : ['No', 'Judul Proyek', 'Deskripsi', 'Tautan'];
    
    return (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100/80">
                    <tr className="border-b border-slate-200">
                        {columns.map((col, index) => (
                        <th key={index} className="px-6 py-4 font-semibold text-slate-600 text-left whitespace-nowrap">
                            {col}
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="text-slate-700">
                    {data.length === 0 ? (
                        <tr><td colSpan={columns.length} className="text-center p-8 text-slate-500">Belum ada data {type}.</td></tr>
                    ) : (
                        data.slice(0, 5).map((item, index) => (
                        <tr key={item.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-center w-16">{index + 1}</td>
                            <td className="px-6 py-4 font-medium">{item.judul}</td>
                            <td className="px-6 py-4">{item.deskripsi}</td>
                            <td className="px-6 py-4 text-center">
                            { type === 'proyek' && (
                                item.tautan ? (
                                <a href={item.tautan} target="_blank" rel="noopener noreferrer" title={item.tautan} className="text-teal-600 hover:text-teal-800 inline-block">
                                    <LinkIcon size={18} />
                                </a>
                                ) : <span className="text-slate-400">-</span>
                            )}
                            { type === 'prestasi' && new Date(item.created_at).toLocaleDateString('id-ID')}
                            </td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [stats, setStats] = useState<StatsData>({ sertifikat: 0, proyek: 0, organisasi: 0 });
  const [prestasi, setPrestasi] = useState<PortofolioItem[]>([]);
  const [proyek, setProyek] = useState<PortofolioItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {

    if (!currentUser?.userId) {
      setIsLoading(false);
      setError("Sesi tidak valid.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const portfolioRes = await api.get('/portfolio');
      const portfolioData: PortofolioItem[] = portfolioRes.data;
      const sertifikatData = portfolioData.filter(item => item.kategori === 'Sertifikasi');
      const proyekData = portfolioData.filter(item => item.kategori === 'Proyek');
      setPrestasi(sertifikatData);
      setProyek(proyekData);
      setStats({
        sertifikat: sertifikatData.length,
        proyek: proyekData.length,
        organisasi: 0
      });
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat data dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800">
            Selamat Datang, {currentUser?.name || 'Mahasiswa'}!
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Ini adalah ringkasan perjalanan akademik dan portofolio Anda.
          </p>
        </div>

        <div className="mb-16">
            <SectionHeader icon={<BarChart3 size={24}/>} title="Ringkasan Statistik" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5">
                    <div className="bg-teal-100 text-teal-600 p-4 rounded-lg"><Award size={24} /></div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">Total Prestasi</div>
                        <div className="text-3xl font-bold text-slate-800">{stats.sertifikat}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5">
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-lg"><Folder size={24} /></div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">Total Proyek</div>
                        <div className="text-3xl font-bold text-slate-800">{stats.proyek}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5">
                    <div className="bg-green-100 text-green-600 p-4 rounded-lg"><UserCheck size={24} /></div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">Status Mahasiswa</div>
                        <div className="text-3xl font-bold text-slate-800">Aktif</div>
                    </div>
                </div>
            </div>
        </div>
      

        <div className="space-y-16">

          <div>
            <SectionHeader icon={<Award size={24} />} title="Prestasi & Sertifikasi Terbaru">
              <Link to="/student/kelola-sertifikasi" className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-800">
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </SectionHeader>
            <TabelDashboard data={prestasi} type="prestasi"/>
          </div>

       
          <div>
            <SectionHeader icon={<Folder size={24} />} title="Proyek Terbaru">
              <Link to="/student/kelola-proyek" className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-800">
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </SectionHeader>
            <TabelDashboard data={proyek} type="proyek"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;