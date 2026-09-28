import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {

  const { id } = await params;
  const body = await req.json();

  const data = await prisma.wilayah.update({
    where: {
      id,
    },
    data: {
      namaWilayah: body.namaWilayah,
    },
  });

  return NextResponse.json(data);
}

export async function DELETE(req, { params }) {

  const { id } = await params;

  await prisma.wilayah.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Berhasil",
  });
}