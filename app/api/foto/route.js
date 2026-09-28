import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.fotoSampah.findMany({
    include: {
      laporan: {
        include: {
          user: true,
          jenisSampah: true,
          wilayah: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const data = await prisma.fotoSampah.create({
    data: {
      imageUrl: body.imageUrl,
      laporanId: body.laporanId,
    },
  });

  return NextResponse.json(data);
}