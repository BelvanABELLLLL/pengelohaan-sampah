"use client";

import { useEffect, useState } from "react";

export default function PenggunaPage() {
  const [data, setData] = useState([]);
  const [idEdit, setIdEdit] = useState(null);

  const [nama, setNama] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================
  // AMBIL DATA
  // ==========================
  async function ambilData() {
    try {
      const res = await fetch("/api/pengguna");

      if (!res.ok) {
        alert("Gagal mengambil data pengguna.");
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
    setNama("");
    setTanggalLahir("");
    setEmail("");
    setNoHp("");
  }

  // ==========================
  // SIMPAN EDIT
  // ==========================
  async function simpan(e) {
    e.preventDefault();

    if (
      nama.trim() === "" ||
      tanggalLahir === "" ||
      email.trim() === "" ||
      noHp.trim() === ""
    ) {
      alert("Semua data wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const body = {
        nama,
        tanggalLahir,
        email,
        noHp,
      };

      const res = await fetch(
        "/api/pengguna/" + idEdit,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (res.status === 403) {
        alert("Anda hanya dapat mengedit akun sendiri.");
        return;
      }

      if (!res.ok) {
        alert("Gagal mengubah data!");
        return;
      }

      alert("Data berhasil diubah!");

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
      "Yakin ingin menghapus akun Anda sendiri?"
    );

    if (!yakin) return;

    try {
      const res = await fetch(
        "/api/pengguna/" + id,
        {
          method: "DELETE",
        }
      );

      if (res.status === 403) {
        alert("Anda hanya dapat menghapus akun sendiri.");
        return;
      }

      if (!res.ok) {
        alert("Gagal menghapus data!");
        return;
      }

      alert(
        "Akun berhasil dihapus. Silakan login kembali jika diperlukan."
      );

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  }

  // ==========================
  // EDIT
  // ==========================
  function edit(item) {
    if (!item.isSelf) return;

    setIdEdit(item.id);
    setNama(item.nama);
    setTanggalLahir(
      item.tanggalLahir.substring(0, 10)
    );
    setEmail(item.email);
    setNoHp(item.noHp);

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
            👤
          </div>

          <div>
            <h1>Pengguna</h1>

            <p>
              Lihat pengguna dan kelola akun Anda sendiri.
            </p>
          </div>

        </div>
      </section>


      {/* ==========================
          FORM EDIT
      ========================== */}
      {idEdit && (
        <section className="crud-card">

          <div className="card-header">

            <h2>
              ✏️ Edit Akun Saya
            </h2>

            <p>
              Ubah informasi akun Anda.
            </p>

          </div>


          <form
            onSubmit={simpan}
            className="crud-form"
          >

            <div className="form-group">
              <label htmlFor="nama">
                Nama Pengguna
              </label>

              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) =>
                  setNama(e.target.value)
                }
                placeholder="Contoh: Jodo"
              />
            </div>


            <div className="form-group">
              <label htmlFor="tanggalLahir">
                Tanggal Lahir
              </label>

              <input
                id="tanggalLahir"
                type="date"
                value={tanggalLahir}
                onChange={(e) =>
                  setTanggalLahir(e.target.value)
                }
              />
            </div>


            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Contoh: jodo@gmail.com"
              />
            </div>


            <div className="form-group">
              <label htmlFor="noHp">
                Nomor HP
              </label>

              <input
                id="noHp"
                type="text"
                value={noHp}
                onChange={(e) =>
                  setNoHp(e.target.value)
                }
                placeholder="08xxxxxxxxxx"
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
                  : "Simpan Perubahan"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Batal
              </button>

            </div>

          </form>

        </section>
      )}


      {/* ==========================
          DAFTAR PENGGUNA
      ========================== */}
      <section className="crud-card">

        <div className="card-header">

          <h2>
            📋 Daftar Pengguna
          </h2>

          <p>
            {data.length} pengguna terdaftar
          </p>

        </div>


        <div className="table-wrapper">

          <table className="data-table">

            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Tanggal Lahir</th>
                <th>Email</th>
                <th>No HP</th>
                <th>Aksi</th>
              </tr>
            </thead>


            <tbody>

              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-table"
                  >

                    <div className="empty-state">

                      <span>👤</span>

                      <strong>
                        Belum ada pengguna
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
                        {item.nama}
                      </strong>

                      {item.isSelf && (
                        <span className="you-badge">
                          Anda
                        </span>
                      )}
                    </td>

                    <td>
                      {item.tanggalLahir.substring(0, 10)}
                    </td>

                    <td>
                      {item.email}
                    </td>

                    <td>
                      {item.noHp}
                    </td>

                    <td>

                      {item.isSelf ? (
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
                      ) : (
                        <span className="no-action">
                          —
                        </span>
                      )}

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