import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // Pastikan path ini benar sesuai struktur Anda
import { useAuth } from '../../contexts/AuthContext';
import { Send } from 'lucide-react';

const RequestCollaboration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook untuk mengakses state dari Link
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    targetEmail: '',
    topic: 'Wawancara',
    description: '',
    collaborationRole: '',
    duration: '',
    additionalMessage: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Efek ini akan mengisi 'Email Tujuan' secara otomatis
  // jika Anda mengklik tombol "Ajak" dari tabel mahasiswa.
  useEffect(() => {
    if (location.state?.studentEmail) {
      setFormData(prev => ({ ...prev, targetEmail: location.state.studentEmail }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.targetEmail || !formData.description) {
      setError("Email Tujuan dan Deskripsi Topik wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        industryUserId: currentUser?.id, // Kirim ID pengirim (industri)
      };
      
      // Panggil API backend untuk membuat permintaan kolaborasi
      // Anda perlu membuat endpoint ini di backend Anda
      await api.post('/collaborations/request', payload);

      setSuccess("Undangan kolaborasi berhasil dikirim! Anda akan dialihkan...");
      
      // Kosongkan form setelah berhasil
      setFormData({
        targetEmail: '', topic: 'Wawancara', description: '',
        collaborationRole: '', duration: '', additionalMessage: '',
      });

      // Kembali ke dashboard industri setelah 2 detik
      setTimeout(() => navigate('/industry'), 2000); 

    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat mengirim undangan.");
      console.error("Gagal mengirim undangan kolaborasi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        className="rounded-lg p-6 sm:p-8 shadow-lg" 
        style={{ backgroundColor: '#75A4A4' }} // Warna dari UI desain Anda
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Form Ajakan Kolaborasi</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Tujuan */}
          <div>
            <label htmlFor="targetEmail" className="block text-sm font-medium text-white mb-1">Email Tujuan</label>
            <input
              type="email"
              id="targetEmail"
              name="targetEmail"
              value={formData.targetEmail}
              onChange={handleChange}
              placeholder="contoh@mahasiswa.com"
              className="w-full px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-teal-300 transition"
              required
            />
          </div>

          {/* Judul Topik */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-white mb-1">Judul Topik</label>
            <select
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-teal-300 transition"
            >
              <option>Wawancara</option>
              <option>Proyek Freelance</option>
              <option>Tugas Akhir</option>
              <option>Magang</option>
              <option>Penelitian Bersama</option>
            </select>
          </div>

          {/* Deskripsi Topik */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-1">Deskripsi Topik</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi singkat mengenai topik"
              className="w-full px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-teal-300 transition"
              required
            />
          </div>

          {/* Peran Kolaborasi */}
          <div>
            <label htmlFor="collaborationRole" className="block text-sm font-medium text-white mb-1">Peran Kolaborasi yang Ditawarkan</label>
            <input
              type="text"
              id="collaborationRole"
              name="collaborationRole"
              value={formData.collaborationRole}
              onChange={handleChange}
              placeholder="Contoh: Narasumber, UI/UX Designer"
              className="w-full px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-teal-300 transition"
            />
          </div>

          {/* Durasi */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-white mb-1">Estimasi Durasi</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Contoh: 3"
                className="w-1/3 px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-teal-300 transition"
              />
              <div className="bg-white px-4 py-2 rounded-md text-slate-600 font-medium">
                Bulan
              </div>
            </div>
          </div>
          
          {/* Pesan Tambahan */}
          <div>
            <label htmlFor="additionalMessage" className="block text-sm font-medium text-white mb-1">Pesan Tambahan (Opsional)</label>
            <textarea
              id="additionalMessage"
              name="additionalMessage"
              rows={3}
              value={formData.additionalMessage}
              onChange={handleChange}
              placeholder="Tulis pesan personal untuk mahasiswa di sini..."
              className="w-full px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-teal-300 transition"
            />
          </div>

          {/* Tombol Kirim */}
          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Undangan'}
              {!isLoading && <Send size={16} />}
            </button>
          </div>

          {/* Notifikasi Error/Sukses */}
          {error && <p className="text-sm font-semibold text-red-200 mt-4 text-center">{error}</p>}
          {success && <p className="text-sm font-semibold text-green-200 mt-4 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default RequestCollaboration;