"use client";

import { useEffect, useState } from "react";

export default function MetodePage() {
  const [data, setData] = useState([]);

  const [idEdit, setIdEdit] = useState(null);
  const [namaMetode, setNamaMetode] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================
  // AMBIL DATA
  // ==========================
  async function ambilData() {
    try {
      const res = await fetch("/api/metode");

      if (!res.ok) {
        alert("Gagal mengambil data metode.");
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
    setNamaMetode("");
    setDeskripsi("");
  }

  // ==========================
  // SIMPAN / UPDATE
  // ==========================
  async function simpan(e) {
    e.preventDefault();

    if (
      namaMetode.trim() === "" ||
      deskripsi.trim() === ""
    ) {
      alert("Semua data wajib diisi!");
      return;
    }

    setLoading(true);

    const body = {
      namaMetode: namaMetode.trim(),
      deskripsi: deskripsi.trim(),
    };

    try {
      let res;

      if (idEdit) {
        res = await fetch("/api/metode/" + idEdit, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/metode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const hasil = await res.json();

        alert(
          hasil.error ||
            (idEdit
              ? "Gagal mengubah data!"
              : "Gagal menambahkan data!")
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
      "Yakin ingin menghapus metode pengolahan ini?"
    );

    if (!yakin) return;

    try {
      const res = await fetch(
        "/api/metode/" + id,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const hasil = await res.json();

        alert(
          hasil.error ||
            "Gagal menghapus data!"
        );

        return;
      }

      alert(
        "Data berhasil dihapus!"
      );

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
    setNamaMetode(item.namaMetode);
    setDeskripsi(item.deskripsi);

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
            ♻️
          </div>

          <div>
            <h1>
              Metode Pengolahan
            </h1>

            <p>
              Kelola metode pengolahan
              sampah.
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
              ? "✏️ Edit Metode Pengolahan"
              : "➕ Tambah Metode Pengolahan"}
          </h2>

          <p>
            {idEdit
              ? "Ubah informasi metode yang dipilih."
              : "Masukkan metode pengolahan baru."}
          </p>

        </div>


        <form
          onSubmit={simpan}
          className="crud-form"
        >

          {/* NAMA METODE */}
          <div className="form-group">

            <label htmlFor="namaMetode">
              Nama Metode
            </label>

            <input
              id="namaMetode"
              type="text"
              value={namaMetode}
              onChange={(e) =>
                setNamaMetode(
                  e.target.value
                )
              }
              placeholder="Contoh: Daur Ulang"
            />

          </div>


          {/* DESKRIPSI */}
          <div className="form-group">

            <label htmlFor="deskripsi">
              Deskripsi
            </label>

            <textarea
              id="deskripsi"
              value={deskripsi}
              onChange={(e) =>
                setDeskripsi(
                  e.target.value
                )
              }
              placeholder="Contoh: Mengolah sampah menjadi produk baru yang dapat digunakan kembali."
              rows="4"
            />

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
          DAFTAR METODE
      ========================== */}
      <section className="crud-card">

        <div className="card-header">

          <h2>
            📋 Daftar Metode Pengolahan
          </h2>

          <p>
            {data.length} metode terdaftar
          </p>

        </div>


        <div className="table-wrapper">

          <table className="data-table">

            <thead>

              <tr>
                <th>No</th>
                <th>Nama Metode</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>

            </thead>


            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="empty-table"
                  >

                    <div className="empty-state">

                      <span>
                        ♻️
                      </span>

                      <strong>
                        Belum ada metode
                      </strong>

                      <p>
                        Tambahkan metode
                        pengolahan menggunakan
                        form di atas.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                data.map(
                  (item, index) => (

                    <tr key={item.id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <strong>
                          {item.namaMetode}
                        </strong>
                      </td>

                      <td>
                        {item.deskripsi}
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

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}