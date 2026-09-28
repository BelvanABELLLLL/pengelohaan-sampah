"use client";

import { useEffect, useState } from "react";

export default function TransaksiPage() {
  const [transaksi, setTransaksi] = useState([]);
  const [jenis, setJenis] = useState([]);
  const [wilayah, setWilayah] = useState([]);
  const [pengguna, setPengguna] = useState([]);

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    berat: "",
    status: "Menunggu",
    userId: "",
    jenisSampahId: "",
    wilayahId: "",
  });

  async function loadData() {
    try {
      setLoading(true);

      const [transaksiRes, jenisRes, wilayahRes] =
        await Promise.all([
          fetch("/api/transaksi"),
          fetch("/api/jenis"),
          fetch("/api/wilayah"),
        ]);

      const transaksiData = await transaksiRes.json();
      const jenisData = await jenisRes.json();
      const wilayahData = await wilayahRes.json();

      if (transaksiRes.ok) {
        setTransaksi(transaksiData.transaksi || []);
        setRole(transaksiData.role || "user");
      } else {
        alert(transaksiData.message || "Gagal mengambil transaksi.");
      }

      if (jenisRes.ok) {
        setJenis(
          Array.isArray(jenisData)
            ? jenisData
            : jenisData.jenis || jenisData.data || []
        );
      }

      if (wilayahRes.ok) {
        setWilayah(
          Array.isArray(wilayahData)
            ? wilayahData
            : wilayahData.wilayah || wilayahData.data || []
        );
      }

      // Admin mengambil daftar pengguna.
      const penggunaRes = await fetch("/api/pengguna");

      if (penggunaRes.ok) {
        const penggunaData = await penggunaRes.json();

        setPengguna(
          Array.isArray(penggunaData)
            ? penggunaData
            : penggunaData.pengguna || penggunaData.data || []
        );
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    setForm({
      berat: "",
      status: "Menunggu",
      userId: "",
      jenisSampahId: "",
      wilayahId: "",
    });

    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.berat || !form.jenisSampahId || !form.wilayahId) {
      alert("Berat, jenis sampah, dan wilayah wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `/api/transaksi/${editingId}`
        : "/api/transaksi";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal menyimpan transaksi.");
        return;
      }

      alert(data.message);

      resetForm();
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);

    setForm({
      berat: item.berat,
      status: item.status,
      userId: item.userId,
      jenisSampahId: item.jenisSampahId,
      wilayahId: item.wilayahId,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id) {
    const yakin = window.confirm(
      "Yakin ingin menghapus transaksi ini?"
    );

    if (!yakin) return;

    try {
      const response = await fetch(`/api/transaksi/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal menghapus transaksi.");
        return;
      }

      alert(data.message);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  }

  return (
    <div className="transaksi-page">
      <div className="page-header">
        <div>
          <h1>Transaksi Sampah</h1>
          <p>
            Kelola transaksi pengelolaan sampah.
          </p>
        </div>
      </div>

      <div className="transaksi-card">
        <h2>
          {editingId
            ? "Edit Transaksi"
            : "Tambah Transaksi"}
        </h2>

        <form onSubmit={handleSubmit}>
          {role === "admin" && (
            <div className="form-group">
              <label>Pengguna</label>

              <select
                name="userId"
                value={form.userId}
                onChange={handleChange}
              >
                <option value="">
                  Pilih Pengguna
                </option>

                {pengguna.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Berat Sampah (kg)</label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="berat"
              value={form.berat}
              onChange={handleChange}
              placeholder="Contoh: 2.5"
            />
          </div>

          <div className="form-group">
            <label>Jenis Sampah</label>

            <select
              name="jenisSampahId"
              value={form.jenisSampahId}
              onChange={handleChange}
            >
              <option value="">
                Pilih Jenis Sampah
              </option>

              {jenis.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.namaSampah}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Wilayah</label>

            <select
              name="wilayahId"
              value={form.wilayahId}
              onChange={handleChange}
            >
              <option value="">
                Pilih Wilayah
              </option>

              {wilayah.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.namaWilayah}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : editingId
                ? "Simpan Perubahan"
                : "Tambah Transaksi"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="transaksi-card">
        <div className="table-header">
          <h2>Data Transaksi</h2>

          <span>
            {transaksi.length} transaksi
          </span>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : transaksi.length === 0 ? (
          <div className="empty-state">
            <div>📦</div>
            <h3>Belum ada transaksi</h3>
            <p>
              Silakan tambahkan transaksi menggunakan
              form di atas.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  {role === "admin" && <th>Pengguna</th>}
                  <th>Berat</th>
                  <th>Jenis Sampah</th>
                  <th>Wilayah</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {transaksi.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    {role === "admin" && (
                      <td>
                        {item.user?.nama || "-"}
                      </td>
                    )}

                    <td>
                      {item.berat} kg
                    </td>

                    <td>
                      {item.jenisSampah?.namaSampah ||
                        "-"}
                    </td>

                    <td>
                      {item.wilayah?.namaWilayah ||
                        "-"}
                    </td>

                    <td>
                      <span
                        className={`status status-${String(
                          item.status
                        )
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        item.tanggalTransaksi
                      ).toLocaleDateString("id-ID")}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleEdit(item)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .transaksi-page {
          padding: 30px;
        }

        .page-header {
          margin-bottom: 25px;
        }

        .page-header h1 {
          margin: 0 0 8px;
          font-size: 30px;
          color: #1f7a35;
        }

        .page-header p {
          margin: 0;
          color: #666;
        }

        .transaksi-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        }

        .transaksi-card h2 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #333;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border: 1px solid #ddd;
          border-radius: 7px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #4d9f63;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        button {
          border: none;
          border-radius: 7px;
          padding: 10px 16px;
          cursor: pointer;
          font-weight: 600;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #2e8b45;
          color: white;
        }

        .btn-secondary {
          background: #777;
          color: white;
        }

        .btn-edit {
          background: #e7a928;
          color: white;
          padding: 7px 11px;
        }

        .btn-delete {
          background: #d9534f;
          color: white;
          padding: 7px 11px;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .table-header h2 {
          margin: 0;
        }

        .table-header span {
          color: #777;
          font-size: 14px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 12px 10px;
          border-bottom: 1px solid #eee;
          text-align: left;
          white-space: nowrap;
        }

        th {
          background: #f7f9f7;
          color: #444;
          font-size: 14px;
        }

        td {
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .status {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #eee;
        }

        .status-menunggu {
          background: #fff3cd;
          color: #856404;
        }

        .status-diproses {
          background: #cfe2ff;
          color: #084298;
        }

        .status-selesai {
          background: #d1e7dd;
          color: #0f5132;
        }

        .status-dibatalkan {
          background: #f8d7da;
          color: #842029;
        }

        .empty-state {
          text-align: center;
          padding: 50px 20px;
          color: #777;
        }

        .empty-state div {
          font-size: 45px;
        }

        .empty-state h3 {
          margin-bottom: 5px;
          color: #444;
        }

        @media (max-width: 700px) {
          .transaksi-page {
            padding: 15px;
          }

          .transaksi-card {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}