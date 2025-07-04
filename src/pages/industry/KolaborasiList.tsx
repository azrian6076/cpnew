import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const KolaborasiList: React.FC = () => {
  const { currentUser } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);

  const fetchInvitations = async () => {
    try {
      const res = await api.get(`/kolaborasi/mahasiswa/${currentUser?.id}`);
      setInvitations(res.data);
    } catch (err) {
      console.error("Gagal ambil undangan:", err);
    }
  };

  const respondInvitation = async (id: string, response: "accepted" | "rejected") => {
    try {
      await api.put(`/kolaborasi/${id}/respond`, { status: response });
      alert(`Undangan ${response === "accepted" ? "diterima" : "ditolak"}`);
      fetchInvitations();
    } catch (err) {
      console.error("Gagal respon:", err);
      alert("Gagal merespon undangan.");
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Undangan Kolaborasi</h2>
      {invitations.length === 0 ? (
        <p className="text-slate-500">Tidak ada undangan.</p>
      ) : (
        <ul className="space-y-4">
          {invitations.map((inv) => (
            <li key={inv.id} className="p-4 bg-white rounded shadow">
              <h3 className="text-lg font-semibold">{inv.judul_proyek}</h3>
              <p className="text-slate-600">{inv.deskripsi}</p>
              <p className="text-slate-400 text-sm">Status: {inv.status}</p>
              {inv.status === "pending" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => respondInvitation(inv.id, "accepted")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Terima
                  </button>
                  <button
                    onClick={() => respondInvitation(inv.id, "rejected")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Tolak
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KolaborasiList;
