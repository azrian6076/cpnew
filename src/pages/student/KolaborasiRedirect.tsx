import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Loader2, AlertCircle } from 'lucide-react';

const KolaborasiRedirect: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestCollaboration = async () => {
      try {
        const res = await api.get('/kolaborasi/latest'); // Ambil undangan terbaru dari backend
        if (res.data && res.data.id) {
          navigate(`/student/kolaborasi/${res.data.id}`); // Redirect ke halaman detail
        } else {
          setError('Tidak ada undangan kolaborasi terbaru.');
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat undangan kolaborasi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestCollaboration();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin mx-auto" size={32} />
        <p className="mt-2 text-slate-500">Memuat undangan kolaborasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle size={32} className="text-red-500 mx-auto" />
        <p className="mt-2 text-red-600">{error}</p>
      </div>
    );
  }

  return null;
};

export default KolaborasiRedirect;
