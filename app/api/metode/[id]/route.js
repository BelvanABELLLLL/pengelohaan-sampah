import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.namaMetode?.trim() || !body.deskripsi?.trim()) {
      return NextResponse.json(
        { error: "Nama metode dan deskripsi wajib diisi." },
        { status: 400 }
      );
    }

    const data = await prisma.metodePengolahan.update({
      where: {
        id,
      },
      data: {
        namaMetode: body.namaMetode.trim(),
        deskripsi: body.deskripsi.trim(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal mengubah metode pengolahan." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.metodePengolahan.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Metode pengolahan berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal menghapus metode pengolahan." },
      { status: 500 }
    );
  }
}