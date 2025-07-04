import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Pencil, X, Link as LinkIcon } from 'lucide-react';
import api from '../../services/api';
import fileImage from '../../assets/file.png';

interface PortofolioItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  file_url: string | null;
  tautan?: string | null;
  created_at: string;
}

const FileModal: React.FC<{ fileUrl: string | null; onClose: () => void }> = ({ fileUrl, onClose }) => {
  const fullFileUrl = fileUrl ? `http://localhost:5000${fileUrl}` : fileImage;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white p-5 rounded-2xl shadow-xl max-w-3xl w-full relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
          <X size={26} />
        </button>
        <img src={fullFileUrl} alt="Hasil Proyek" className="w-full rounded-xl" />
      </div>
    </div>
  );
};

const FormProyek: React.FC<{
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData: PortofolioItem | null;
}> = ({ onSubmit, onCancel, initialData }) => {
  const isEditMode = !!initialData;
  const [judul, setJudul] = useState(initialData?.judul || '');
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');
  const [tautan, setTautan] = useState(initialData?.tautan || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(initialData?.file_url?.split('/').pop() || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('tautan', tautan || '');
    formData.append('kategori', 'Proyek');
    if (selectedFile) {
      formData.append('portofolioFile', selectedFile);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-2xl shadow-lg p-6">
      <div className="md:col-span-2 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Proyek</label>
          <input
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            placeholder="Contoh: Website E-Commerce"
            className="w-full p-3 bg-teal-50 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tautan / Github</label>
          <input
            value={tautan}
            onChange={(e) => setTautan(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full p-3 bg-teal-50 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Proyek</label>
          <textarea
            rows={4}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            required
            placeholder="Jelaskan proyek secara singkat..."
            className="w-full p-3 bg-teal-50 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
          />
        </div>
      </div>
      <div className="md:col-span-1 flex flex-col gap-4">
        <label className="block text-sm font-semibold text-gray-700">Unggah Hasil (Opsional)</label>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-40 bg-teal-50 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer hover:bg-teal-100"
        >
          <Upload className="w-6 h-6 text-teal-500 mb-2" />
          <p className="text-sm text-teal-600">{fileName || 'Pilih File (Gambar/PDF)'}</p>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      <div className="md:col-span-3 flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-teal-200 text-teal-600 hover:bg-teal-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 shadow-md"
        >
          {isEditMode ? 'Simpan Perubahan' : 'Simpan Proyek'}
        </button>
      </div>
    </form>
  );
};

const TabelProyek: React.FC<{
  data: PortofolioItem[];
  onEdit: (item: PortofolioItem) => void;
  onDelete: (id: string) => void;
  onViewFile: (fileUrl: string | null) => void;
}> = ({ data, onEdit, onDelete, onViewFile }) => (
  <div className="bg-teal-500 rounded-2xl shadow-lg p-4">
    <div className="overflow-x-auto bg-white rounded-xl">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Judul Proyek</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">File</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tautan</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">Belum ada data proyek.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id} className="hover:bg-teal-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{item.judul}</td>
                <td className="px-4 py-3">{item.deskripsi}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onViewFile(item.file_url)}
                    disabled={!item.file_url}
                    className="text-gray-600 hover:text-teal-600 disabled:text-gray-400"
                  >
                    <FileText size={18} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  {item.tautan ? (
                    <a
                      href={item.tautan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800"
                    >
                      <LinkIcon size={18} />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const KelolaProyek: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');
  const [proyekList, setProyekList] = useState<PortofolioItem[]>([]);
  const [editingData, setEditingData] = useState<PortofolioItem | null>(null);
  const [modalFileUrl, setModalFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProyek = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/portfolio');
      const allPortfolio: PortofolioItem[] = response.data;
      const filteredProyek = allPortfolio.filter(item => item.kategori === 'Proyek');
      setProyekList(filteredProyek);
    } catch (error) {
      console.error("Gagal mengambil data proyek:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'list') {
      fetchProyek();
    }
  }, [activeView]);

  const handleEdit = (item: PortofolioItem) => {
    setEditingData(item);
    setActiveView('form');
  };

  const handleAddNew = () => {
    setEditingData(null);
    setActiveView('form');
  };

  const handleCancel = () => {
    setEditingData(null);
    setActiveView('list');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      try {
        await api.delete(`/portfolio/${id}`);
        fetchProyek();
      } catch (error) {
        console.error("Gagal menghapus proyek:", error);
        alert("Gagal menghapus proyek.");
      }
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (editingData) {
        await api.put(`/portfolio/${editingData.id}`, data);
      } else {
        await api.post('/portfolio', data);
      }
      setActiveView('list');
      setEditingData(null);
    } catch (error) {
      console.error("Gagal menyimpan proyek:", error);
      alert("Gagal menyimpan proyek. Pastikan semua field terisi.");
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {activeView === 'list' ? 'Daftar Proyek' : editingData ? 'Edit Proyek' : 'Tambah Proyek'}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleAddNew}
                className={`px-5 py-2 rounded-lg font-medium text-sm ${activeView === 'form' && !editingData ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 border hover:bg-teal-50'}`}
              >
                Tambah Proyek
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`px-5 py-2 rounded-lg font-medium text-sm ${activeView === 'list' ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 border hover:bg-teal-50'}`}
              >
                Lihat Daftar
              </button>
            </div>
          </div>

          <div className="mt-6">
            {activeView === 'form' ? (
              <FormProyek onSubmit={handleSubmit} onCancel={handleCancel} initialData={editingData} />
            ) : isLoading ? (
              <div className="text-center py-10 text-gray-500">Memuat data proyek...</div>
            ) : (
              <TabelProyek data={proyekList} onEdit={handleEdit} onDelete={handleDelete} onViewFile={(url) => setModalFileUrl(url)} />
            )}
          </div>
        </div>
      </div>
      {modalFileUrl && <FileModal fileUrl={modalFileUrl} onClose={() => setModalFileUrl(null)} />}
    </>
  );
};

export default KelolaProyek;
