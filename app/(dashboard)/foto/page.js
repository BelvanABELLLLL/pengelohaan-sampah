"use client";

import { useEffect, useState } from "react";

export default function FotoPage() {
  const [data, setData] = useState([]);
  const [laporan, setLaporan] = useState([]);

  const [idEdit, setIdEdit] = useState(null);

  const [imageUrl, setImageUrl] = useState("");
  const [laporanId, setLaporanId] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================
  // AMBIL DATA
  // ==========================
  async function ambilData() {
    try {
      const fotoRes = await fetch("/api/foto");
      const fotoData = await fotoRes.json();

      const laporanRes = await fetch("/api/laporan");
      const laporanData = await laporanRes.json();

      setData(fotoData);
      setLaporan(laporanData);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data.");
    }
  }

  useEffect(() => {
    ambilData();
  }, []);

  // ==========================
  // PILIH FILE
  // ==========================
  function pilihFile(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Kalau sedang tambah foto,
    // imageUrl belum perlu diisi.
  }

  // ==========================
  // RESET FORM
  // ==========================
  function resetForm() {
    setIdEdit(null);
    setImageUrl("");
    setLaporanId("");
    setSelectedFile(null);
    setPreviewUrl("");
  }

  // ==========================
  // UPLOAD FILE
  // ==========================
  async function uploadFile() {
    if (!selectedFile) {
      return imageUrl;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const hasil = await res.json();

    if (!res.ok) {
      throw new Error(
        hasil.message || "Gagal upload foto."
      );
    }

    return hasil.imageUrl;
  }

  // ==========================
  // SIMPAN / UPDATE
  // ==========================
  async function simpan(e) {
    e.preventDefault();

    if (!laporanId) {
      alert("Laporan wajib dipilih!");
      return;
    }

    // Saat tambah harus memilih file
    if (!idEdit && !selectedFile) {
      alert("Silakan pilih foto terlebih dahulu!");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = imageUrl;

      // Kalau ada file baru → upload
      if (selectedFile) {
        finalImageUrl = await uploadFile();
      }

      if (!finalImageUrl) {
        alert("Foto belum dipilih.");
        return;
      }

      const body = {
        imageUrl: finalImageUrl,
        laporanId,
      };

      let res;

      if (idEdit) {
        res = await fetch(
          "/api/foto/" + idEdit,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
      } else {
        res = await fetch("/api/foto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        throw new Error(
          idEdit
            ? "Gagal mengubah data."
            : "Gagal menambahkan data."
        );
      }

      alert(
        idEdit
          ? "Foto berhasil diubah!"
          : "Foto berhasil ditambahkan!"
      );

      resetForm();
      await ambilData();
    } catch (error) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // HAPUS
  // ==========================
  async function hapus(id) {
    const yakin = confirm(
      "Yakin ingin menghapus data foto ini?"
    );

    if (!yakin) return;

    try {
      const res = await fetch(
        "/api/foto/" + id,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        alert("Gagal menghapus foto!");
        return;
      }

      alert("Foto berhasil dihapus!");

      await ambilData();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  }

  // ==========================
  // EDIT
  // ==========================
  function edit(item) {
    setIdEdit(item.id);
    setImageUrl(item.imageUrl);
    setLaporanId(item.laporanId);

    setSelectedFile(null);
    setPreviewUrl(item.imageUrl);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="crud-page">

      {/* ==========================
          HEADER
      ========================== */}
      <section className="page-header">

        <div className="page-title-row">

          <div className="page-title-icon">
            📷
          </div>

          <div>
            <h1>Foto Sampah</h1>

            <p>
              Kelola dokumentasi foto dari laporan sampah.
            </p>
          </div>

        </div>

      </section>


      {/* ==========================
          FORM
      ========================== */}
      <section className="crud-card">

        <div className="card-header">

          <h2>
            {idEdit
              ? "✏️ Edit Foto"
              : "➕ Tambah Foto"}
          </h2>

          <p>
            {idEdit
              ? "Ubah foto atau laporan yang terkait."
              : "Pilih foto dari komputer dan hubungkan dengan laporan."}
          </p>

        </div>


        <form
          onSubmit={simpan}
          className="crud-form"
        >

          {/* FOTO */}
          <div className="form-group">

            <label htmlFor="foto">
              Foto Sampah
            </label>

            <input
              id="foto"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={pilihFile}
            />

          </div>


          {/* PREVIEW */}
          {previewUrl && (
            <div className="photo-preview">

              <p>
                Preview:
              </p>

              <img
                src={previewUrl}
                alt="Preview foto sampah"
              />

            </div>
          )}


          {/* LAPORAN */}
          <div className="form-group">

            <label htmlFor="laporan">
              Laporan
            </label>

            <select
              id="laporan"
              value={laporanId}
              onChange={(e) =>
                setLaporanId(e.target.value)
              }
            >

              <option value="">
                -- Pilih Laporan --
              </option>

              {laporan.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.user.nama} -{" "}
                  {item.jenisSampah.namaSampah}
                </option>
              ))}

            </select>

          </div>


          {/* BUTTON */}
          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Menyimpan..."
                : idEdit
                  ? "Simpan Perubahan"
                  : "Simpan Foto"}
            </button>


            {idEdit && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Batal
              </button>
            )}

          </div>

        </form>

      </section>


      {/* ==========================
          DAFTAR FOTO
      ========================== */}
      <section className="crud-card">

        <div className="card-header">

          <h2>
            📋 Daftar Foto Sampah
          </h2>

          <p>
            {data.length} foto tersimpan
          </p>

        </div>


        <div className="table-wrapper">

          <table className="data-table">

            <thead>

              <tr>
                <th>No</th>
                <th>Foto</th>
                <th>Pelapor</th>
                <th>Jenis Sampah</th>
                <th>Aksi</th>
              </tr>

            </thead>


            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="empty-table"
                  >

                    <div className="empty-state">

                      <span>📷</span>

                      <strong>
                        Belum ada foto
                      </strong>

                    </div>

                  </td>

                </tr>

              ) : (

                data.map((item, index) => (

                  <tr key={item.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>

                      <img
                        src={item.imageUrl}
                        alt="Foto sampah"
                        className="table-photo"
                      />

                    </td>

                    <td>
                      {item.laporan?.user?.nama ||
                        "-"}
                    </td>

                    <td>
                      {item.laporan?.jenisSampah
                        ?.namaSampah || "-"}
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            edit(item)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            hapus(item.id)
                          }
                        >
                          🗑️ Hapus
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}