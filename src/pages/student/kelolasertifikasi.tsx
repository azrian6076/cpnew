import React, { useState, useEffect } from 'react';
import { FiUpload, FiFileText, FiTrash2, FiX } from 'react-icons/fi';
import { FaPenToSquare } from "react-icons/fa6";
import SertifikatImage from '../../assets/sertfikat.png';
import api from "../../services/api"; 

interface PortofolioItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  file_url: string | null;
  created_at: string;
}


interface SertifikatModalProps {
  item: PortofolioItem;
  onClose: () => void;
}

const SertifikatModal: React.FC<SertifikatModalProps> = ({ item, onClose }) => {
  const fullFileUrl = item.file_url ? `http://localhost:5000${item.file_url}` : SertifikatImage;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{item.judul}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
        </div>
        <div className="bg-gray-100 p-2 rounded-md">
          <img src={fullFileUrl} alt={`Sertifikat untuk ${item.judul}`} className="w-full h-auto rounded" />
        </div>
      </div>
    </div>
  );
};


interface SertifikasiFormProps {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  initialData: PortofolioItem | null;
}

const SertifikasiForm: React.FC<SertifikasiFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const isEditMode = !!initialData;
  const [judul, setJudul] = useState(initialData?.judul || '');
  const [sumber, setSumber] = useState(initialData?.deskripsi || '');
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
    formData.append('deskripsi', sumber); 
    formData.append('kategori', 'Sertifikasi');
    if (selectedFile) {
      formData.append('portofolioFile', selectedFile); 
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <label htmlFor="judul" className="block text-sm font-semibold text-gray-700 mb-2">Judul Sertifikasi</label>
          <input type="text" id="judul" placeholder="Contoh: Juara 1 Lomba UI/UX" value={judul} onChange={(e) => setJudul(e.target.value)} required className="w-full p-4 bg-teal-50 border border-teal-200 rounded-xl"/>
        </div>
        <div>
          <label htmlFor="sumber" className="block text-sm font-semibold text-gray-700 mb-2">Penyelenggara / Sumber</label>
          <input type="text" id="sumber" placeholder="Contoh: Universitas Indonesia" value={sumber} onChange={(e) => setSumber(e.target.value)} required className="w-full p-4 bg-teal-50 border border-teal-200 rounded-xl"/>
        </div>
      </div>
      <div className="lg:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Unggah Sertifikat</label>
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 bg-teal-50 border-2 border-teal-200 border-dashed rounded-xl cursor-pointer hover:bg-teal-100">
          <div className="p-3 bg-teal-200 rounded-lg mb-3"><FiUpload className="w-6 h-6 text-teal-600" /></div>
          {fileName ? <p className="text-sm font-semibold text-teal-700 px-2 text-center">{fileName}</p> : <p className="text-lg font-semibold text-gray-400">Pilih File</p>}
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
       <div className="lg:col-span-3 mt-2 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-white text-gray-600 font-semibold text-sm border">Batal</button>
          <button type="submit" className="px-6 py-2 rounded-lg bg-teal-500 text-white font-semibold text-sm shadow-md">{isEditMode ? 'Simpan Perubahan' : 'Simpan'}</button>
        </div>
    </form>
  );
};


interface TabelProps {
  data: PortofolioItem[];
  onEdit: (item: PortofolioItem) => void;
  onDelete: (id: string) => void;
  onViewFile: (item: PortofolioItem) => void;
}

const TabelDaftarSertifikasi: React.FC<TabelProps> = ({ data, onEdit, onDelete, onViewFile }) => (
  <div className="bg-teal-500 rounded-xl p-4 lg:p-6 shadow-lg">
    <div className="overflow-x-auto bg-white rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="text-gray-800">
          <tr className="border-b border-gray-300">
            <th className="px-4 py-3 font-semibold text-left w-16">No</th>
            <th className="px-4 py-3 font-semibold text-left">Judul</th>
            <th className="px-4 py-3 font-semibold text-left">Sumber</th>
            <th className="px-4 py-3 font-semibold text-left">Tanggal Upload</th>
            <th className="px-4 py-3 font-semibold text-left">File</th>
            <th className="px-4 py-3 font-semibold text-left">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {data.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8 text-gray-500">Belum ada data sertifikasi.</td></tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3">{item.judul}</td>
                <td className="px-4 py-3">{item.deskripsi}</td>
                <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-3">
                    <button onClick={() => onViewFile(item)} className="ttext-gray-600 hover:text-teal-600 disabled:text-gray-300" disabled={!item.file_url}>
                        <FiFileText size={20} />
                    </button>
                </td>
                <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onDelete(item.id)} className="text-gray-500 hover:text-red-500"><FiTrash2 size={18} /></button>
                        <button onClick={() => onEdit(item)} className="text-gray-500 hover:text-blue-500"><FaPenToSquare size={18} /></button>
                    </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);


const KelolaSertifikasiPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');
  const [sertifikasiList, setSertifikasiList] = useState<PortofolioItem[]>([]);
  const [editingData, setEditingData] = useState<PortofolioItem | null>(null);
  const [selectedSertifikat, setSelectedSertifikat] = useState<PortofolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const fetchSertifikasi = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/portfolio');
      const allPortfolio: PortofolioItem[] = response.data;
      
      const filteredSertifikasi = allPortfolio.filter(item => item.kategori === 'Sertifikasi');
      setSertifikasiList(filteredSertifikasi);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
      alert('Gagal memuat data. Coba refresh halaman.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'list') {
      fetchSertifikasi();
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
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
          await api.delete(`/portfolio/${id}`);
          fetchSertifikasi();
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          alert('Gagal menghapus data.');
        }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingData) {
        await api.put(`/portfolio/${editingData.id}`, formData);
      } else {

        await api.post('/portfolio', formData);
      }
      setActiveView('list');
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert('Gagal menyimpan data. Pastikan semua field terisi dan file (jika ada) valid.');
    }
  };
  
  const handleViewFile = (item: PortofolioItem) => setSelectedSertifikat(item);
  const handleCloseModal = () => setSelectedSertifikat(null);

  const getPageTitle = () => {
    if(activeView === 'list') return 'Kelola Portofolio Sertifikasi';
    return editingData ? 'Edit Sertifikasi' : 'Tambah Sertifikasi Baru';
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">{getPageTitle()}</h1>
            <div className="flex items-center gap-2">
              <button onClick={handleAddNew} className={`px-4 py-2 rounded-lg font-semibold text-sm ${activeView === 'form' && !editingData ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 border'}`}>
                Tambah Baru
              </button>
              <button onClick={() => setActiveView('list')} className={`px-4 py-2 rounded-lg font-semibold text-sm ${activeView === 'list' ? 'bg-teal-500 text-white' : 'bg-white text-gray-600 border'}`}>
                Lihat Daftar
              </button>
            </div>
          </div>

          <div className="mt-8">
            {activeView === 'form' ? (
              <SertifikasiForm onSubmit={handleSubmit} onCancel={handleCancel} initialData={editingData} />
            ) : isLoading ? (
              <div className="text-center py-10">Memuat data...</div>
            ) : (
              <TabelDaftarSertifikasi data={sertifikasiList} onEdit={handleEdit} onDelete={handleDelete} onViewFile={handleViewFile} />
            )}
          </div>
        </div>
      </div>

      {selectedSertifikat && <SertifikatModal item={selectedSertifikat} onClose={handleCloseModal} />}
    </>
  );
};

export default KelolaSertifikasiPage;