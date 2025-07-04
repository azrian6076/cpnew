import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import { useAuth } from '../../context/AuthContext'; 
import { Search, ChevronDown, User, ChevronsRight } from 'lucide-react';


interface Student {
  userId: string;
  mahasiswaId: string;
  name: string;
  email: string;
  keahlian: string | null;
}


const skills = ["UI/UX", "Frontend", "Backend", "Data Analyst"];

const LecturerDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/students'); 
        setStudents(response.data);
      } catch (err) {
        console.error("Gagal mengambil data mahasiswa:", err);
        setError("Tidak dapat memuat data mahasiswa. Coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSkill = selectedSkill ? student.keahlian === selectedSkill : true;
      return matchesSearch && matchesSkill;
    });
  }, [students, searchTerm, selectedSkill]);



  const handleViewPortfolio = (studentUserId: string) => {
    
    if (!user || !user.role) {
      console.error("Tidak dapat navigasi: Role pengguna tidak ditemukan dalam konteks.");
      return; 
    }

   
    const rolePath = user.role.toLowerCase() === 'dosen' ? 'lecturer' : user.role.toLowerCase();

    
    const targetUrl = `/${rolePath}/portofolio/${studentUserId}`;

    console.log(`Navigasi dinamis ke: ${targetUrl}`);
    navigate(targetUrl);
  };
  

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat data mahasiswa...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

 
  return (
    <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
       
        <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-800">Pencarian Talenta Mahasiswa</h1>
            <p className="mt-2 text-lg text-slate-500">
                Temukan mahasiswa berdasarkan nama atau keahlian spesifik.
            </p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="relative md:col-span-3">
                <input
                    type="text"
                    placeholder="Cari nama mahasiswa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            <div className="relative md:col-span-2">
                <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option value="">Semua Keahlian</option>
                    {skills.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
        </div>

        {/* Tabel Mahasiswa */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100">
                        <tr className="border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold text-slate-600 text-left">Nama Mahasiswa</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-left">Email</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-left">Keahlian</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.userId} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-teal-100 text-teal-700 font-bold w-10 h-10 rounded-full flex items-center justify-center">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{student.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${student.keahlian ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'}`}>
                                            {student.keahlian || 'Belum diisi'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleViewPortfolio(student.userId)} className="text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1 mx-auto">
                                            <span>Lihat Portofolio</span>
                                            <ChevronsRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="text-center p-8 text-slate-500">
                                Tidak ada mahasiswa yang cocok dengan kriteria pencarian.
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;