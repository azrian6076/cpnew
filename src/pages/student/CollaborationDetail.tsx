import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { User, Briefcase, MessageSquare, Check, X } from 'lucide-react';

interface CollaborationDetailData {
  id: string;
  judul_proyek: string;
  deskripsi: string;
  pesan_detail: string;
  status: 'pending' | 'accepted' | 'rejected';
  lecturer_name: string;
}

const CollaborationDetail: React.FC = () => {
  const { collaborationId } = useParams<{ collaborationId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [collaboration, setCollaboration] = useState<CollaborationDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborationDetail = useCallback(async () => {
    if (!collaborationId) {
      setError("ID Kolaborasi tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get(`/kolaborasi/${collaborationId}`);
      setCollaboration(response.data);
    } catch (err) {
      console.error("Gagal mengambil detail kolaborasi:", err);
      setError("Tidak dapat memuat detail undangan kolaborasi. Mungkin sudah tidak valid.");
    } finally {
      setIsLoading(false);
    }
  }, [collaborationId]);

  useEffect(() => {
    fetchCollaborationDetail();
  }, [fetchCollaborationDetail]);

  const handleRespond = async (response: 'accepted' | 'rejected') => {
    setIsResponding(true);
    try {
      await api.put(`/kolaborasi/${collaborationId}/respond`, { status: response });
      alert(`Anda telah ${response === 'accepted' ? 'menerima' : 'menolak'} undangan kolaborasi ini.`);
      navigate('/student/kolaborasi');
    } catch (err) {
      console.error("Gagal merespons undangan:", err);
      alert("Gagal mengirim respons. Silakan coba lagi.");
    } finally {
      setIsResponding(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Memuat detail undangan...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h2>
        <p className="text-slate-500 mt-2">{error}</p>
      </div>
    );
  }

  if (!collaboration) {
    return <div className="p-8 text-center text-slate-500">Undangan tidak ditemukan.</div>;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 sm:p-8 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold">Undangan Kolaborasi Proyek</h1>
            <p className="text-teal-100 mt-1 text-sm">Anda diundang untuk bergabung dalam proyek berikut:</p>
          </div>

          {/* Detail Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full text-teal-600 shadow-sm">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Judul Proyek</p>
                <p className="text-lg sm:text-xl font-semibold text-slate-800">{collaboration.judul_proyek}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full text-slate-600 shadow-sm">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Dosen Pengajak</p>
                <p className="text-lg sm:text-xl font-semibold text-slate-800">{collaboration.lecturer_name}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Deskripsi Proyek</p>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border">{collaboration.deskripsi}</p>
            </div>

            {collaboration.pesan_detail && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Pesan dari Dosen</p>
                <div className="flex gap-3 p-4 rounded-lg border bg-slate-50 text-slate-700">
                  <MessageSquare size={20} className="text-slate-400 flex-shrink-0 mt-1" />
                  <p className="italic">"{collaboration.pesan_detail}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-slate-50/70 border-t flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
            {collaboration.status === 'pending' ? (
              <>
                <p className="text-sm font-medium text-slate-600">Apakah Anda tertarik untuk bergabung?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRespond('rejected')}
                    disabled={isResponding}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-red-400 text-red-600 hover:bg-red-50 disabled:opacity-50 transition duration-200"
                  >
                    <X size={16} /> Tolak
                  </button>
                  <button
                    onClick={() => handleRespond('accepted')}
                    disabled={isResponding}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 transition duration-200"
                  >
                    <Check size={16} /> Terima
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-lg font-semibold">
                {collaboration.status === 'accepted' ? (
                  <span className="flex items-center text-green-600"><Check size={20} /> Undangan Diterima</span>
                ) : (
                  <span className="flex items-center text-red-600"><X size={20} /> Undangan Ditolak</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationDetail;
