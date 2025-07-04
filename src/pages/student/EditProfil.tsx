import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nim, setNim] = useState('');
  const [keahlian, setKeahlian] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5000/api/mahasiswa/${user.id}`)
        .then((res) => {
          setNim(res.data.nim || '');
          setKeahlian(res.data.keahlian || '');
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching profile:', err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/mahasiswa/${user.id}`, {
        nim,
        keahlian,
      });
      alert('Profil berhasil diperbarui');
      navigate('/student'); 
    } catch (err) {
      console.error('Gagal memperbarui profil:', err);
      alert('Gagal menyimpan perubahan');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Edit Profil Mahasiswa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">NIM</label>
          <input
            type="text"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-full mt-1 border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Keahlian</label>
          <select
            value={keahlian}
            onChange={(e) => setKeahlian(e.target.value)}
            className="w-full mt-1 border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Pilih Keahlian</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Data Analyst">Data Analyst</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
