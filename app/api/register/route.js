import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      nama,
      tanggalLahir,
      email,
      noHp,
      password,
    } = body;

    // Validasi sederhana
    if (
      !nama ||
      !tanggalLahir ||
      !email ||
      !noHp ||
      !password
    ) {
      return NextResponse.json(
        {
          message: "Semua data wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Cek email sudah digunakan
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          message: "Email sudah terdaftar.",
        },
        { status: 400 }
      );
    }

    // Cek nomor HP sudah digunakan
    const existingNoHp = await prisma.user.findUnique({
      where: {
        noHp,
      },
    });

    if (existingNoHp) {
      return NextResponse.json(
        {
          message: "Nomor HP sudah terdaftar.",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user
    await prisma.user.create({
      data: {
        nama,
        tanggalLahir: new Date(tanggalLahir),
        email,
        noHp,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}