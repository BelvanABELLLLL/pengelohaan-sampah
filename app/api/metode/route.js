import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.metodePengolahan.findMany({
      orderBy: {
        namaMetode: "asc",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal mengambil data metode pengolahan." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.namaMetode?.trim() || !body.deskripsi?.trim()) {
      return NextResponse.json(
        { error: "Nama metode dan deskripsi wajib diisi." },
        { status: 400 }
      );
    }

    const data = await prisma.metodePengolahan.create({
      data: {
        namaMetode: body.namaMetode.trim(),
        deskripsi: body.deskripsi.trim(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal menambahkan metode pengolahan." },
      { status: 500 }
    );
  }
}