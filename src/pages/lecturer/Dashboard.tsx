import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Search, Users, Code, Brush, BarChart2, Server, Layers } from 'lucide-react'; // Tambahkan icon untuk Fullstack

interface Student {
  userId: string;
  mahasiswaId: string;
  nim: string;
  name: string;
  email: string;
  keahlian: string | null;
}

// 🔥 Tambahkan Fullstack
const skills = ["UI/UX", "Frontend", "Backend", "Data Analyst", "Fullstack"];

const getSkillBadgeStyle = (skill: string | null) => {
  switch (skill) {
    case 'UI/UX': return 'bg-purple-100 text-purple-800 ring-1 ring-purple-200';
    case 'Frontend': return 'bg-sky-100 text-sky-800 ring-1 ring-sky-200';
    case 'Backend': return 'bg-amber-100 text-amber-800 ring-1 ring-amber-200';
    case 'Data Analyst': return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
    case 'Fullstack': return 'bg-lime-100 text-lime-800 ring-1 ring-lime-200'; // 🎯 Warna untuk Fullstack
    default: return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
  }
};

const LecturerDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/students');
        setStudents(response.data);
      } catch (err) {
        console.error("Gagal mengambil data mahasiswa:", err);
        setError("Tidak dapat memuat data mahasiswa.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nim.includes(searchTerm)) &&
      (selectedSkill ? student.keahlian === selectedSkill : true)
    );
  }, [students, searchTerm, selectedSkill]);

  const statistics = useMemo(() => {
    const total = students.length;
    const skillCounts = skills.reduce((acc, skill) => {
      acc[skill] = students.filter(s => s.keahlian === skill).length;
      return acc;
    }, {} as Record<string, number>);
    return { total, ...skillCounts };
  }, [students]);

  const handleViewPortfolio = (studentUserId: string) => {
    navigate(`/lecturer/portofolio/${studentUserId}`);
  };

  const StatCard = ({ icon, label, value, colorClass }: { icon: React.ReactNode; label: string; value: number; colorClass: string }) => (
    <div className="bg-white/70 p-4 rounded-xl flex items-center gap-4 border border-slate-200 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-4">Memuat data talenta...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ✅ Intro Section */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 sm:p-8 shadow-md">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            Selamat Datang di Sistem E‑Portofolio
          </h1>
          <p className="text-white text-sm sm:text-base leading-relaxed">
            Sistem E‑Portofolio Mahasiswa UAD adalah platform digital yang menyimpan dan menampilkan seluruh data mahasiswa, mulai dari prestasi, proyek, hingga aktivitas organisasi secara terstruktur.
          </p>
        </div>

        {/* 📊 Statistik */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Ringkasan Talenta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard icon={<Users size={18} className="text-blue-600" />} label="Total Mahasiswa" value={statistics.total} colorClass="bg-blue-100" />
            <StatCard icon={<Brush size={18} className="text-purple-600" />} label="UI/UX Designer" value={statistics['UI/UX']} colorClass="bg-purple-100" />
            <StatCard icon={<Code size={18} className="text-sky-600" />} label="Frontend Dev" value={statistics['Frontend']} colorClass="bg-sky-100" />
            <StatCard icon={<Server size={18} className="text-amber-600" />} label="Backend Dev" value={statistics['Backend']} colorClass="bg-amber-100" />
            <StatCard icon={<BarChart2 size={18} className="text-emerald-600" />} label="Data Analyst" value={statistics['Data Analyst']} colorClass="bg-emerald-100" />
            <StatCard icon={<Layers size={18} className="text-lime-600" />} label="Fullstack Dev" value={statistics['Fullstack']} colorClass="bg-lime-100" />
          </div>
        </div>

        {/* 🔍 Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Cari nama atau NIM mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <Search size={18} className="absolute right-3 top-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="filterSkill" className="text-sm font-medium text-slate-600">Filter Keahlian:</label>
            <select
              id="filterSkill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="">Semua</option>
              {skills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 👨‍🎓 List Mahasiswa */}
        <div>
          {filteredStudents.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Tidak ada mahasiswa yang sesuai.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <div key={student.userId} className="bg-slate-50 p-4 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">{student.name}</h3>
                    {student.keahlian && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSkillBadgeStyle(student.keahlian)}`}>
                        {student.keahlian}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm">{student.email}</p>
                  <p className="text-slate-500 text-sm mb-2">NIM: {student.nim}</p>
                  <button
                    onClick={() => handleViewPortfolio(student.userId)}
                    className="mt-2 w-full bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-600 transition"
                  >
                    Lihat Portofolio
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
