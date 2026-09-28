import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);


// ==========================
// VERIFIKASI USER
// ==========================
async function getCurrentUser(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    return payload;
  } catch (error) {
    return null;
  }
}


// ==========================
// UPDATE
// ==========================
export async function PUT(request, { params }) {
  try {
    const payload = await getCurrentUser(request);

    if (!payload) {
      return NextResponse.json(
        { message: "Belum login." },
        { status: 401 }
      );
    }

    const currentUserId = payload.userId;

    const { id } = await params;

    // Hanya boleh edit akun sendiri
    if (id !== currentUserId) {
      return NextResponse.json(
        {
          message:
            "Anda hanya dapat mengedit akun sendiri.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (
      !body.nama ||
      !body.tanggalLahir ||
      !body.email ||
      !body.noHp
    ) {
      return NextResponse.json(
        {
          message: "Semua data wajib diisi.",
        },
        { status: 400 }
      );
    }

    const data = await prisma.user.update({
      where: {
        id,
      },

      data: {
        nama: body.nama,
        tanggalLahir: new Date(body.tanggalLahir),
        email: body.email,
        noHp: body.noHp,
      },

      // Jangan kembalikan password
      select: {
        id: true,
        nama: true,
        tanggalLahir: true,
        email: true,
        noHp: true,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("PENGGUNA PUT ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengubah data." },
      { status: 500 }
    );
  }
}


// ==========================
// DELETE
// ==========================
export async function DELETE(request, { params }) {
  try {
    const payload = await getCurrentUser(request);

    if (!payload) {
      return NextResponse.json(
        { message: "Belum login." },
        { status: 401 }
      );
    }

    const currentUserId = payload.userId;

    const { id } = await params;

    // Hanya boleh hapus akun sendiri
    if (id !== currentUserId) {
      return NextResponse.json(
        {
          message:
            "Anda hanya dapat menghapus akun sendiri.",
        },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Berhasil menghapus akun.",
    });
  } catch (error) {
    console.error("PENGGUNA DELETE ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus akun." },
      { status: 500 }
    );
  }
}