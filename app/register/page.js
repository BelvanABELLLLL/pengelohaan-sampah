"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    tanggalLahir: "",
    email: "",
    noHp: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      alert("Registrasi berhasil!");

      router.push("/");
    } catch (error) {
      console.error(error);

      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">

        <div className="login-logo">
          🗑
        </div>

        <h1>Buat Akun</h1>

        <p className="login-subtitle">
          Daftar ke Sistem Pengelolaan Sampah
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="nama">
              Nama
            </label>

            <input
              id="nama"
              name="nama"
              type="text"
              placeholder="Masukkan nama"
              value={form.nama}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="tanggalLahir">
              Tanggal Lahir
            </label>

            <input
              id="tanggalLahir"
              name="tanggalLahir"
              type="date"
              value={form.tanggalLahir}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Masukkan email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="noHp">
              Nomor HP
            </label>

            <input
              id="noHp"
              name="noHp"
              type="text"
              placeholder="08xxxxxxxxxx"
              value={form.noHp}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="register-text">
          Sudah punya akun?{" "}

          <Link href="/">
            Kembali ke Login
          </Link>
        </p>

      </div>
    </main>
  );
}