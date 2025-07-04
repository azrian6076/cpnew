import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api'; 
import { Award, Folder, User, Mail, GraduationCap, Sparkles, Link as LinkIcon, FileText, X } from 'lucide-react';

// Tipe data (tidak ada perubahan)
interface StudentDetail {
  name: string;
  email: string;
  avatar: string | null;
  nim: string | null;
  keahlian: string | null;
}
interface PortfolioItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: 'Proyek' | 'Sertifikasi';
  tautan?: string | null;
  file_url: string | null;
  created_at: string;
}

// Komponen Modal File Viewer (tidak ada perubahan)
const FileViewerModal: React.FC<{ fileUrl: string; onClose: () => void }> = ({ fileUrl, onClose }) => {
  const fullFileUrl = `http://localhost:5000${fileUrl}`;
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <div className="flex-grow p-2 overflow-auto">
          {isPdf ? (
            <iframe src={fullFileUrl} title="File Viewer" className="w-full h-full border-0"></iframe>
          ) : (
            <img src={fullFileUrl} alt="File Preview" className="w-full h-auto" />
          )}
        </div>
      </div>
    </div>
  );
};



interface PortfolioTableProps {
    titleIcon: React.ReactNode;
    title: string;
    columns: string[];
    data: PortfolioItem[];
    onViewFile: (fileUrl: string) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ titleIcon, title, columns, data, onViewFile }) => {
    return (
        <div className="bg-teal-500 rounded-xl p-1 shadow-lg">
            <div className="bg-teal-500 p-4 rounded-t-lg">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    {titleIcon}
                    {title}
                </h2>
            </div>
            <div className="overflow-x-auto bg-white rounded-b-lg p-2">
                <table className="min-w-full text-sm">
                    <thead className="text-slate-700">
                        <tr className="border-b-2 border-slate-200">
                            {columns.map((col, index) => (
                                <th key={index} className="px-4 py-3 font-semibold text-left whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {data.length === 0 ? (
                            <tr><td colSpan={columns.length} className="text-center p-8 text-slate-500">Belum ada data.</td></tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={item.id} className="border-b border-slate-200 last:border-b-0">
                                    <td className="px-4 py-3 w-16 text-center">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium">{item.judul}</td>
                                    <td className="px-4 py-3">{item.deskripsi}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {columns.includes('Tanggal') 
                                            ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})
                                            : (
                                                item.tautan ? (
                                                    <a href={item.tautan} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                                                        Lihat Tautan
                                                    </a>
                                                ) : '-'
                                            )
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => item.file_url && onViewFile(item.file_url)} disabled={!item.file_url} className="text-slate-500 hover:text-teal-600 disabled:text-slate-300 disabled:cursor-not-allowed">
                                            <FileText size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


const StudentPortfolioDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingFileUrl, setViewingFileUrl] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // ... Logika fetch data tetap sama ...
    if (!userId) return;
    setIsLoading(true);
    try {
      const [studentRes, portfolioRes] = await Promise.all([
        api.get(`/students/${userId}/profile`),
        api.get(`/students/${userId}/portfolio`)
      ]);
      setStudent(studentRes.data);
      setPortfolios(portfolioRes.data);
    } catch (err) {
      setError("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat portofolio...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!student) {
    return <div className="p-8 text-center text-slate-500">Mahasiswa tidak ditemukan.</div>;
  }
  
  const sertifikasi = portfolios.filter(p => p.kategori === 'Sertifikasi');
  const proyek = portfolios.filter(p => p.kategori === 'Proyek');

  return (
    <>
      <div className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          
            <PortfolioTable 
                titleIcon={<Award />}
                title={`Daftar Prestasi ${student.name}`}
                columns={['No', 'Judul Sertifikasi', 'Sumber Sertifikasi', 'Tanggal', 'File']}
                data={sertifikasi}
                onViewFile={(url) => setViewingFileUrl(url)}
            />

            
            <PortfolioTable 
                titleIcon={<Folder />}
                title={`Daftar Proyek ${student.name}`}
                columns={['No', 'Judul Proyek', 'Deskripsi proyek', 'Tautan', 'File']}
                data={proyek}
                onViewFile={(url) => setViewingFileUrl(url)}
            />
        </div>
      </div>
      
      {viewingFileUrl && <FileViewerModal fileUrl={viewingFileUrl} onClose={() => setViewingFileUrl(null)} />}
    </>
  );
};

export default StudentPortfolioDetail;