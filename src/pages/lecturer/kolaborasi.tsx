import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// Tipe data dari backend
interface CollaborationEntry {
  id: string;
  judul_proyek: string;
  deskripsi: string;
  status: string;
  lecturer_name: string;
  student_name: string;
}

interface Student {
  userId: string;
  name: string;
}

const Kolaborasi: React.FC = () => {
    const [formData, setFormData] = useState({
        judulProyek: '',
        deskripsiSingkat: '',
        pesan: '',
    });
    const [collaborations, setCollaborations] = useState<CollaborationEntry[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🌟 State untuk toggle form
    const [showForm, setShowForm] = useState(false);

    const fetchCollaborations = useCallback(async () => {
        try {
            const response = await api.get('/kolaborasi');
            setCollaborations(response.data);
        } catch (error) {
            console.error("Gagal mengambil data kolaborasi", error);
            setError("Tidak dapat memuat daftar kolaborasi.");
        }
    }, []);
    
    const fetchStudents = useCallback(async () => {
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error("Gagal mengambil daftar mahasiswa", error);
            setError("Tidak dapat memuat daftar mahasiswa.");
        }
    }, []);
    
    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchCollaborations(), fetchStudents()]).finally(() => setIsLoading(false));
    }, [fetchCollaborations, fetchStudents]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !formData.judulProyek || !formData.deskripsiSingkat) {
            alert('Mohon pilih mahasiswa dan isi semua field yang wajib.');
            return;
        }

        const payload = {
            invitedStudentUserId: selectedStudent,
            judulProyek: formData.judulProyek,
            deskripsi: formData.deskripsiSingkat,
            pesanDetail: formData.pesan,
        };

        try {
            const response = await api.post('/kolaborasi', payload);
            alert(response.data.message);
            setFormData({ judulProyek: '', deskripsiSingkat: '', pesan: '' });
            setSelectedStudent('');
            setShowForm(false); // ✅ Sembunyikan form setelah submit
            fetchCollaborations(); 
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Gagal mengajukan kolaborasi.';
            alert(errorMessage);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen p-4 sm:p-8 flex flex-col items-center gap-16 font-sans">

            {/* 🔘 Tombol untuk Tampilkan/Sembunyikan Form */}
            <div className="w-full max-w-6xl flex justify-end mb-4">
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-teal-600 transition"
                    >
                        + Ajukan Kolaborasi
                    </button>
                ) : (
                    <button
                        onClick={() => setShowForm(false)}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-red-600 transition"
                    >
                        ✕ Tutup Form
                    </button>
                )}
            </div>

            {/* 📝 Form Ajukan Kolaborasi */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-8">
                        <h1 className="text-3xl font-bold text-white">Ajukan Kolaborasi Proyek</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-1">
                            <label htmlFor="judulProyek" className="block text-sm font-semibold text-gray-600 mb-2">Judul Proyek</label>
                            <input type="text" name="judulProyek" value={formData.judulProyek} onChange={handleChange} required className="w-full p-3 bg-slate-50 border rounded-lg"/>
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="invitedStudent" className="block text-sm font-semibold text-gray-600 mb-2">Undang Mahasiswa</label>
                            <select id="invitedStudent" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required className="w-full p-3 bg-slate-50 border rounded-lg">
                                <option value="" disabled>-- Pilih Mahasiswa --</option>
                                {students.map(student => (
                                    <option key={student.userId} value={student.userId}>{student.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="deskripsiSingkat" className="block text-sm font-semibold text-gray-600 mb-2">Deskripsi Singkat</label>
                            <textarea name="deskripsiSingkat" rows={3} value={formData.deskripsiSingkat} onChange={handleChange} required className="w-full p-3 bg-slate-50 border rounded-lg"/>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="pesan" className="block text-sm font-semibold text-gray-600 mb-2">Pesan Detail (Opsional)</label>
                            <textarea name="pesan" rows={4} value={formData.pesan} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-lg"/>
                        </div>
                        <div className="md:col-span-2 flex justify-end pt-6">
                            <button type="submit" className="bg-teal-500 text-white font-bold py-3 px-10 rounded-lg shadow-lg hover:bg-teal-600">Ajukan Kolaborasi</button>
                        </div>
                    </form>
                </div>
            )}

            {/* 📋 Daftar Kolaborasi */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-6xl">
                <h2 className="text-2xl font-bold text-slate-700 mb-6">Daftar Ajakan Kolaborasi</h2>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <p className="text-center p-8 text-slate-500">Memuat data...</p>
                    ) : error ? (
                         <p className="text-center p-8 text-red-500">{error}</p>
                    ) : (
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="p-4 font-bold text-gray-600">Mahasiswa Diundang</th>
                                <th className="p-4 font-bold text-gray-600">Proyek</th>
                                <th className="p-4 font-bold text-gray-600">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {collaborations.map((collab) => (
                                <tr key={collab.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                <td className="p-4 text-gray-800 font-semibold">{collab.student_name}</td>
                                <td className="p-4">
                                    <p className="font-semibold text-gray-900">{collab.judul_proyek}</p>
                                    <p className="text-gray-500">{collab.deskripsi}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        collab.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        collab.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {collab.status}
                                    </span>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kolaborasi;
