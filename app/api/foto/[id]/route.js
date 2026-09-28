import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  const data = await prisma.fotoSampah.update({
    where: {
      id,
    },
    data: {
      imageUrl: body.imageUrl,
      laporanId: body.laporanId,
    },
  });

  return NextResponse.json(data);
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  await prisma.fotoSampah.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Berhasil dihapus",
  });
}