import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search,
  ChevronDown,
  Users,
  Briefcase,
  ChevronsRight,
} from 'lucide-react';

interface Student {
  userId: string;
  name: string;
  email: string;
  keahlian: string | null;
  avatar?: string; // optional avatar
}

const skills = ["UI/UX", "Frontend", "Backend", "Data Analyst"];

const IndustryDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/students');
        console.log("Data Mahasiswa dari API:", response.data);
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
      const nameMatch = student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const skillMatch = selectedSkill
        ? student.keahlian === selectedSkill
        : true;
      return nameMatch && skillMatch;
    });
  }, [students, searchTerm, selectedSkill]);

  const handleViewPortfolio = (studentUserId: string) => {
    navigate(`/industry/portofolio/${studentUserId}`);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat data mahasiswa...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="bg-teal-100 p-4 rounded-full">
            <Users className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Total Talenta</p>
            <p className="text-3xl font-bold text-slate-800">{students.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="bg-cyan-100 p-4 rounded-full">
            <Briefcase className="w-8 h-8 text-cyan-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Kategori Keahlian</p>
            <p className="text-3xl font-bold text-slate-800">{skills.length}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-2/3">
          <input
            type="text"
            placeholder="Cari nama mahasiswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <div className="relative w-full md:w-1/3">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Semua Keahlian</option>
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Daftar Mahasiswa */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div
              key={student.userId}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    student.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0D9488&color=fff`
                  }
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="font-semibold text-slate-800">{student.name}</p>
                  <p className="text-sm text-slate-500">{student.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Keahlian:</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                  ${student.keahlian ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
                  {student.keahlian || "Belum diisi"}
                </span>
              </div>
              <button
                onClick={() => handleViewPortfolio(student.userId)}
                className="mt-auto flex items-center gap-2 text-teal-600 hover:text-teal-800 font-semibold"
              >
                Lihat Portofolio <ChevronsRight size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-8 text-slate-500">
            Tidak ada mahasiswa yang cocok dengan kriteria pencarian.
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryDashboard;
