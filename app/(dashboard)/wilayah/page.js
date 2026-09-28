"use client";

import { useEffect, useState } from "react";

export default function WilayahPage() {
  // ==========================
  // STATE
  // ==========================
  const [data, setData] = useState([]);

  const [idEdit, setIdEdit] = useState(null);
  const [namaWilayah, setNamaWilayah] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================
  // AMBIL DATA
  // ==========================
  async function ambilData() {
    try {
      const res = await fetch("/api/wilayah");

      if (!res.ok) {
        alert("Gagal mengambil data wilayah.");
        return;
      }

      const hasil = await res.json();
      setData(hasil);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  }

  useEffect(() => {
    ambilData();
  }, []);

  // ==========================
  // RESET FORM
  // ==========================
  function resetForm() {
    setIdEdit(null);
    setNamaWilayah("");
  }

  // ==========================
  // SIMPAN / UPDATE
  // ==========================
  async function simpan(e) {
    e.preventDefault();

    if (namaWilayah.trim() === "") {
      alert("Nama wilayah wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const body = {
        namaWilayah: namaWilayah.trim(),
      };

      let res;

      if (idEdit) {
        res = await fetch("/api/wilayah/" + idEdit, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/wilayah", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        alert(
          idEdit
            ? "Gagal mengubah data!"
            : "Gagal menambahkan data!"
        );
        return;
      }

      alert(
        idEdit
          ? "Data berhasil diubah!"
          : "Data berhasil ditambahkan!"
      );

      resetForm();
      await ambilData();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // HAPUS
  // ==========================
  async function hapus(id) {
    const yakin = confirm(
      "Yakin ingin menghapus wilayah ini?"
    );

    if (!yakin) return;

    try {
      const res = await fetch(
        "/api/wilayah/" + id,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        alert("Gagal menghapus data!");
        return;
      }

      alert("Data berhasil dihapus!");

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
    setNamaWilayah(item.namaWilayah);

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
            📍
          </div>

          <div>
            <h1>Wilayah Sampah</h1>

            <p>
              Kelola wilayah atau daerah pengelolaan sampah.
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
              ? "✏️ Edit Wilayah"
              : "➕ Tambah Wilayah"}
          </h2>

          <p>
            {idEdit
              ? "Ubah informasi wilayah yang dipilih."
              : "Masukkan wilayah baru ke dalam sistem."}
          </p>

        </div>


        <form
          onSubmit={simpan}
          className="crud-form"
        >

          <div className="form-group">

            <label htmlFor="namaWilayah">
              Nama Wilayah
            </label>

            <input
              id="namaWilayah"
              type="text"
              value={namaWilayah}
              onChange={(e) =>
                setNamaWilayah(e.target.value)
              }
              placeholder="Contoh: Jawa Barat"
            />

          </div>


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
                  : "Simpan Data"}
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
          DAFTAR WILAYAH
      ========================== */}
      <section className="crud-card">

        <div className="card-header">

          <h2>
            📋 Daftar Wilayah
          </h2>

          <p>
            {data.length} wilayah terdaftar
          </p>

        </div>


        <div className="table-wrapper">

          <table className="data-table">

            <thead>

              <tr>
                <th>No</th>
                <th>Nama Wilayah</th>
                <th>Aksi</th>
              </tr>

            </thead>


            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="empty-table"
                  >

                    <div className="empty-state">

                      <span>📍</span>

                      <strong>
                        Belum ada wilayah
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
                      <strong>
                        {item.namaWilayah}
                      </strong>
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