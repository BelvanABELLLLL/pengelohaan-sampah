import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    // Cocokkan password dengan hash di database
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    // Buat JWT
    const token = await new SignJWT({
      userId: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    const response = NextResponse.json(
      {
        message: "Login berhasil.",
      },
      { status: 200 }
    );

    // Simpan JWT di cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}