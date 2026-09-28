"use client";

import { useEffect, useState } from "react";

export default function JenisPage() {
  // ==========================
  // STATE
  // ==========================
  const [data, setData] = useState([]);

  const [metodeData, setMetodeData] = useState([]);
  const [metodeIds, setMetodeIds] = useState([]);

  const [idEdit, setIdEdit] = useState(null);

  const [namaSampah, setNamaSampah] = useState("");
  const [jenisSampah, setJenisSampah] = useState("");
  const [statusSampah, setStatusSampah] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================
  // AMBIL DATA JENIS SAMPAH
  // ==========================
  async function ambilData() {
    try {
      const res = await fetch("/api/jenis");

      if (!res.ok) {
        throw new Error("Gagal mengambil data jenis sampah");
      }

      const hasil = await res.json();

      setData(hasil);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }

  // ==========================
  // AMBIL DATA METODE
  // ==========================
  async function ambilMetode() {
    try {
      const res = await fetch("/api/metode");

      if (!res.ok) {
        throw new Error("Gagal mengambil metode pengolahan");
      }

      const hasil = await res.json();

      setMetodeData(hasil);
    } catch (error) {
      console.error(
        "Gagal mengambil metode:",
        error
      );
    }
  }

  // ==========================
  // LOAD AWAL
  // ==========================
  useEffect(() => {
    ambilData();
    ambilMetode();
  }, []);

  // ==========================
  // RESET FORM
  // ==========================
  function resetForm() {
    setIdEdit(null);
    setNamaSampah("");
    setJenisSampah("");
    setStatusSampah("");
    setMetodeIds([]);
  }

  // ==========================
  // PILIH / UNPILIH METODE
  // ==========================
  function toggleMetode(id) {
    setMetodeIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(
          (item) => item !== id
        );
      }

      return [...prev, id];
    });
  }

  // ==========================
  // SIMPAN / UPDATE
  // ==========================
  async function simpan(e) {
    e.preventDefault();

    if (
      namaSampah.trim() === "" ||
      jenisSampah === "" ||
      statusSampah === ""
    ) {
      alert("Semua data wajib diisi!");
      return;
    }

    setLoading(true);

    const body = {
      namaSampah: namaSampah.trim(),
      jenisSampah,
      statusSampah,
      metodeIds,
    };

    try {
      let res;

      // ==========================
      // UPDATE
      // ==========================
      if (idEdit) {
        res = await fetch(
          "/api/jenis/" + idEdit,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) {
          const hasil = await res.json();

          alert(
            hasil.error ||
            "Gagal mengubah data!"
          );

          return;
        }

        alert("Data berhasil diubah!");
      }

      // ==========================
      // CREATE
      // ==========================
      else {
        res = await fetch("/api/jenis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const hasil = await res.json();

          alert(
            hasil.error ||
            "Gagal menambahkan data!"
          );

          return;
        }

        alert(
          "Data berhasil ditambahkan!"
        );
      }

      resetForm();

      await ambilData();
    } catch (error) {
      console.error(error);

      alert(
        "Terjadi kesalahan saat menyimpan data!"
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // HAPUS
  // ==========================
  async function hapus(id) {
    const yakin = confirm(
      "Yakin ingin menghapus data ini?"
    );

    if (!yakin) return;

    try {
      const res = await fetch(
        "/api/jenis/" + id,
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

      alert("Data berhasil dihapus!");

      await ambilData();
    } catch (error) {
      console.error(error);

      alert(
        "Terjadi kesalahan saat menghapus data!"
      );
    }
  }

  // ==========================
  // EDIT
  // ==========================
  function edit(item) {
    setIdEdit(item.id);

    setNamaSampah(
      item.namaSampah || ""
    );

    setJenisSampah(
      item.jenisSampah || ""
    );

    setStatusSampah(
      item.statusSampah || ""
    );

    // Ambil ID metode yang sudah terhubung
    const selectedMetode =
      item.metode?.map(
        (itemMetode) =>
          itemMetode.metodePengolahanId
      ) || [];

    setMetodeIds(selectedMetode);

    // Scroll ke atas/form
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

        <div>
          <div className="page-title-row">

            <div className="page-title-icon">
              🗑️
            </div>

            <div>
              <h1>
                Jenis Sampah
              </h1>

              <p>
                Kelola data jenis dan
                kategori sampah.
              </p>
            </div>

          </div>
        </div>

      </section>


      {/* ==========================
          FORM
      ========================== */}
      <section className="crud-card">

        <div className="card-header">

          <div>
            <h2>
              {idEdit
                ? "✏️ Edit Data Sampah"
                : "➕ Tambah Jenis Sampah"}
            </h2>

            <p>
              {idEdit
                ? "Ubah informasi jenis sampah yang dipilih."
                : "Masukkan informasi sampah baru ke dalam sistem."}
            </p>
          </div>

        </div>


        <form
          onSubmit={simpan}
          className="crud-form"
        >

          {/* ==========================
              NAMA SAMPAH
          ========================== */}
          <div className="form-group">

            <label htmlFor="namaSampah">
              Nama Sampah
            </label>

            <input
              id="namaSampah"
              type="text"
              value={namaSampah}
              onChange={(e) =>
                setNamaSampah(
                  e.target.value
                )
              }
              placeholder="Contoh: Botol Plastik"
            />

          </div>


          {/* ==========================
              JENIS SAMPAH
          ========================== */}
          <div className="form-group">

            <label htmlFor="jenisSampah">
              Jenis Sampah
            </label>

            <select
              id="jenisSampah"
              value={jenisSampah}
              onChange={(e) =>
                setJenisSampah(
                  e.target.value
                )
              }
            >

              <option value="">
                -- Pilih Jenis --
              </option>

              <option value="Organik">
                Organik
              </option>

              <option value="Anorganik">
                Anorganik
              </option>

              <option value="B3">
                B3
              </option>

              <option value="Residu">
                Residu
              </option>

            </select>

          </div>


          {/* ==========================
              STATUS SAMPAH
          ========================== */}
          <div className="form-group">

            <label htmlFor="statusSampah">
              Status Sampah
            </label>

            <select
              id="statusSampah"
              value={statusSampah}
              onChange={(e) =>
                setStatusSampah(
                  e.target.value
                )
              }
            >

              <option value="">
                -- Pilih Status --
              </option>

              <option value="Basah">
                Basah
              </option>

              <option value="Kering">
                Kering
              </option>

            </select>

          </div>


          {/* ==========================
              METODE PENGOLAHAN
          ========================== */}
          <div className="form-group">

            <label>
              Metode Pengolahan
            </label>

            <div className="metode-list">

              {metodeData.length === 0 ? (

                <p>
                  Belum ada metode
                  pengolahan.
                </p>

              ) : (

                metodeData.map(
                  (metode) => (

                    <label
                      key={metode.id}
                      className="metode-checkbox"
                    >

                      <input
                        type="checkbox"
                        checked={metodeIds.includes(
                          metode.id
                        )}
                        onChange={() =>
                          toggleMetode(
                            metode.id
                          )
                        }
                      />

                      <span>
                        {metode.namaMetode}
                      </span>

                    </label>

                  )
                )

              )}

            </div>

          </div>


          {/* ==========================
              BUTTON
          ========================== */}
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
          TABLE
      ========================== */}
      <section className="crud-card">

        <div className="card-header table-header">

          <div>

            <h2>
              📋 Daftar Jenis Sampah
            </h2>

            <p>
              {data.length} data tersimpan
            </p>

          </div>

        </div>


        <div className="table-wrapper">

          <table className="data-table">

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Nama Sampah
                </th>

                <th>
                  Jenis
                </th>

                <th>
                  Status
                </th>

                <th>
                  Metode Pengolahan
                </th>

                <th>
                  Aksi
                </th>

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

                      <span>
                        🗑️
                      </span>

                      <strong>
                        Belum ada data
                      </strong>

                      <p>
                        Tambahkan jenis
                        sampah menggunakan
                        form di atas.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                data.map(
                  (item, index) => (

                    <tr key={item.id}>

                      {/* NO */}
                      <td>
                        {index + 1}
                      </td>


                      {/* NAMA */}
                      <td>

                        <strong>
                          {item.namaSampah}
                        </strong>

                      </td>


                      {/* JENIS */}
                      <td>

                        <span
                          className={`category-badge category-${item.jenisSampah
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {item.jenisSampah}
                        </span>

                      </td>


                      {/* STATUS */}
                      <td>

                        <span
                          className={
                            item.statusSampah ===
                              "Basah"
                              ? "status-badge status-wet"
                              : "status-badge status-dry"
                          }
                        >
                          {item.statusSampah}
                        </span>

                      </td>


                      {/* METODE */}
                      <td>

                        {item.metode &&
                          item.metode.length > 0 ? (

                          <div className="metode-table-list">

                            {item.metode.map(
                              (relasi) => (

                                <span
                                  key={
                                    relasi.metodePengolahanId
                                  }
                                  className="status-badge status-dry"
                                  style={{
                                    display:
                                      "inline-block",
                                    marginRight:
                                      "6px",
                                    marginBottom:
                                      "4px",
                                  }}
                                >
                                  {
                                    relasi
                                      .metodePengolahan
                                      ?.namaMetode
                                  }
                                </span>

                              )
                            )}

                          </div>

                        ) : (

                          <span>
                            Belum ada metode
                          </span>

                        )}

                      </td>


                      {/* AKSI */}
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