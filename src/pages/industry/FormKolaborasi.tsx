import React, { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const FormKolaborasi: React.FC = () => {
  const { currentUser } = useAuth();
  const [emailTujuan, setEmailTujuan] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [pesan, setPesan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Cari user id mahasiswa dari email
      const userRes = await api.get(`/users/email/${emailTujuan}`);
      const invitedStudentId = userRes.data.id;

      // Kirim undangan
      await api.post("/kolaborasi", {
        judul_proyek: judul,
        deskripsi,
        pesan_detail: pesan,
        invited_student_user_id: invitedStudentId,
        industry_user_id: currentUser?.id,
      });

      alert("✅ Undangan berhasil dikirim!");
      setEmailTujuan("");
      setJudul("");
      setDeskripsi("");
      setPesan("");
    } catch (err) {
      console.error("Gagal:", err);
      alert("❌ Gagal mengirim undangan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-teal-100 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Form Kirim Kolaborasi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email Mahasiswa Tujuan"
          value={emailTujuan}
          onChange={(e) => setEmailTujuan(e.target.value)}
          className="w-full p-2 rounded border"
          required
        />
        <input
          type="text"
          placeholder="Judul Proyek"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full p-2 rounded border"
          required
        />
        <textarea
          placeholder="Deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full p-2 rounded border"
        ></textarea>
        <textarea
          placeholder="Pesan Tambahan (Opsional)"
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          className="w-full p-2 rounded border"
        ></textarea>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 disabled:opacity-50"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Undangan"}
        </button>
      </form>
    </div>
  );
};

export default FormKolaborasi;
