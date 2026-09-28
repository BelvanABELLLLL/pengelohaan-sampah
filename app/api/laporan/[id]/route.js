import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function PUT(req, { params }) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Belum login." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await req.json();

  const laporan = await prisma.laporanSampah.findUnique({
    where: {
      id,
    },
  });

  if (!laporan) {
    return NextResponse.json(
      { message: "Laporan tidak ditemukan." },
      { status: 404 }
    );
  }

  // USER hanya boleh mengubah laporan miliknya
  if (
    user.role !== "admin" &&
    laporan.userId !== user.userId
  ) {
    return NextResponse.json(
      {
        message:
          "Anda hanya dapat mengubah laporan milik sendiri.",
      },
      { status: 403 }
    );
  }

  const data = await prisma.laporanSampah.update({
    where: {
      id,
    },

    data: {
      berat: Number(body.berat),
      jenisSampahId: body.jenisSampahId,
      wilayahId: body.wilayahId,

      // Jangan izinkan User mengganti pemilik laporan.
      // Admin boleh mempertahankan pemilik yang sudah ada.
      userId: laporan.userId,
    },
  });

  return NextResponse.json(data);
}

export async function DELETE(req, { params }) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Belum login." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const laporan = await prisma.laporanSampah.findUnique({
    where: {
      id,
    },
  });

  if (!laporan) {
    return NextResponse.json(
      { message: "Laporan tidak ditemukan." },
      { status: 404 }
    );
  }

  // USER hanya boleh menghapus laporan sendiri
  if (
    user.role !== "admin" &&
    laporan.userId !== user.userId
  ) {
    return NextResponse.json(
      {
        message:
          "Anda hanya dapat menghapus laporan milik sendiri.",
      },
      { status: 403 }
    );
  }

  await prisma.laporanSampah.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Berhasil dihapus",
  });
}