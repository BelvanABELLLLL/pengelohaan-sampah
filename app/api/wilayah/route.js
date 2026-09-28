import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.wilayah.findMany({
    orderBy: {
      namaWilayah: "asc",
    },
  });

  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const data = await prisma.wilayah.create({
    data: {
      namaWilayah: body.namaWilayah,
    },
  });

  return NextResponse.json(data);
}