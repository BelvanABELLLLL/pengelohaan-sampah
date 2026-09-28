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

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Belum login." },
      { status: 401 }
    );
  }

  const where =
    user.role === "admin"
      ? {}
      : {
          userId: user.userId,
        };

  const data = await prisma.laporanSampah.findMany({
    where,

    include: {
      user: true,
      jenisSampah: true,
      wilayah: true,
      foto: true,
    },

    orderBy: {
      tanggalLapor: "desc",
    },
  });

  return NextResponse.json(data);
}

export async function POST(req) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Belum login." },
      { status: 401 }
    );
  }

  const body = await req.json();

  const data = await prisma.laporanSampah.create({
    data: {
      berat: Number(body.berat),

      // USER ID DIAMBIL DARI TOKEN
      // bukan dari body
      userId: user.userId,

      jenisSampahId: body.jenisSampahId,
      wilayahId: body.wilayahId,
    },
  });

  return NextResponse.json(data);
}