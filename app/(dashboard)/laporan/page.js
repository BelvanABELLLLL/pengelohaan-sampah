"use client";

import { useEffect, useState } from "react";

export default function LaporanPage() {
  const [data, setData] = useState([]);

  const [users, setUsers] = useState([]);
  const [jenis, setJenis] = useState([]);
  const [wilayah, setWilayah] = useState([]);

  const [idEdit, setIdEdit] = useState(null);

  const [berat, setBerat] = useState("");
  const [userId, setUserId] = useState("");
  const [jenisSampahId, setJenisSampahId] = useState("");
  const [wilayahId, setWilayahId] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================
  // AMBIL SEMUA DATA
  // ==========================
  async function ambilSemuaData() {
    try {
      const laporanRes = await fetch("/api/laporan");
      const laporanData = await laporanRes.json();

      const userRes = await fetch("/api/pengguna");
      const userData = await userRes.json();

      const jenisRes = await fetch("/api/jenis");
      const jenisData = await jenisRes.json();

      const wilayahRes = await fetch("/api/wilayah");
      const wilayahData = await wilayahRes.json();

      setData(laporanData);
      setUsers(userData);
      setJenis(jenisData);
      setWilayah(wilayahData);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data.");
    }
  }

  useEffect(() => {
    ambilSemuaData();
  }, []);

  // ==========================
  // RESET FORM
  // ==========================
  function resetForm() {
    setIdEdit(null);
    setBerat("");
    setUserId("");
    setJenisSampahId("");
    setWilayahId("");
  }

  // ==========================
  // SIMPAN / UPDATE
  // ==========================
  async function simpan(e) {
    e.preventDefault();

    if (
      berat === "" ||
      userId === "" ||
      jenisSampahId === "" ||
      wilayahId === ""
    ) {
      alert("Semua data wajib diisi!");
      return;
    }

    if (Number(berat) <= 0) {
      alert("Berat sampah harus lebih dari 0 kg!");
      return;
    }

    setLoading(true);

    try {
      const body = {
        berat,
        userId,
        jenisSampahId,
        wilayahId,
      };

      let res;

      if (idEdit) {
        res = await fetch("/api/laporan/" + idEdit, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/laporan", {
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
            ? "Gagal mengubah laporan!"
            : "Gagal menambahkan laporan!"
        );
        return;
      }

      alert(
        idEdit
          ? "Laporan berhasil diubah!"
          : "Laporan berhasil ditambahkan!"
      );

      resetForm();
      await ambilSemuaData();
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
      "Yakin ingin menghapus laporan ini?"
    );

    if (!yakin) return;

    try {
      const res = await fetch(
        "/api/laporan/" + id,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        alert("Gagal menghapus laporan!");
        return;
      }

      alert("Laporan berhasil dihapus!");

      await ambilSemuaData();
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
    setBerat(item.berat);
    setUserId(item.userId);
    setJenisSampahId(item.jenisSampahId);
    setWilayahId(item.wilayahId);

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
            📝
          </div>

          <div>
            <h1>Laporan Sampah</h1>

            <p>
              Kelola laporan pemilahan dan pengelolaan sampah.
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
              ? "✏️ Edit Laporan"
              : "➕ Tambah Laporan"}
          </h2>

          <p>
            {idEdit
              ? "Ubah informasi laporan sampah."
              : "Masukkan data laporan sampah baru."}
          </p>

        </div>


        <form
          onSubmit={simpan}
          className="crud-form"
        >

          {/* BERAT */}
          <div className="form-group">

            <label htmlFor="berat">
              Berat Sampah
            </label>

            <div className="input-with-unit">

              <input
                id="berat"
                type="number"
                min="0.01"
                step="0.01"
                value={berat}
                onChange={(e) =>
                  setBerat(e.target.value)
                }
                placeholder="Contoh: 2.5"
              />

              <span>kg</span>

            </div>

          </div>


          {/* PENGGUNA */}
          <div className="form-group">

            <label htmlFor="user">
              Pengguna
            </label>

            <select
              id="user"
              value={userId}
              onChange={(e) =>
                setUserId(e.target.value)
              }
            >

              <option value="">
                -- Pilih Pengguna --
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.nama}
                </option>
              ))}

            </select>

          </div>


          {/* JENIS */}
          <div className="form-group">

            <label htmlFor="jenis">
              Jenis Sampah
            </label>

            <select
              id="jenis"
              value={jenisSampahId}
              onChange={(e) =>
                setJenisSampahId(e.target.value)
              }
            >

              <option value="">
                -- Pilih Jenis Sampah --
              </option>

              {jenis.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.namaSampah}
                </option>
              ))}

            </select>

          </div>


          {/* WILAYAH */}
          <div className="form-group">

            <label htmlFor="wilayah">
              Wilayah
            </label>

            <select
              id="wilayah"
              value={wilayahId}
              onChange={(e) =>
                setWilayahId(e.target.value)
              }
            >

              <option value="">
                -- Pilih Wilayah --
              </option>

              {wilayah.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.namaWilayah}
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
                  : "Simpan Laporan"}
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
          DAFTAR LAPORAN
      ========================== */}
      <section className="crud-card">

        <div className="card-header">

          <h2>
            📋 Daftar Laporan
          </h2>

          <p>
            {data.length} laporan tercatat
          </p>

        </div>


        <div className="table-wrapper">

          <table className="data-table">

            <thead>

              <tr>
                <th>No</th>
                <th>Pengguna</th>
                <th>Jenis Sampah</th>
                <th>Wilayah</th>
                <th>Berat</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>

            </thead>


            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-table"
                  >

                    <div className="empty-state">

                      <span>📝</span>

                      <strong>
                        Belum ada laporan
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
                      {item.user?.nama || "-"}
                    </td>

                    <td>
                      {item.jenisSampah?.namaSampah || "-"}
                    </td>

                    <td>
                      {item.wilayah?.namaWilayah || "-"}
                    </td>

                    <td>
                      <strong>
                        {item.berat} kg
                      </strong>
                    </td>

                    <td>
                      {new Date(
                        item.tanggalLapor
                      ).toLocaleDateString("id-ID")}
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