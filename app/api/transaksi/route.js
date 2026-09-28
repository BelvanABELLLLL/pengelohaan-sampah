import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Belum login." },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const where = dbUser.role === "admin"
      ? {}
      : { userId: dbUser.id };

    const transaksi = await prisma.transaksiSampah.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
          },
        },
        jenisSampah: {
          select: {
            id: true,
            namaSampah: true,
            jenisSampah: true,
          },
        },
        wilayah: {
          select: {
            id: true,
            namaWilayah: true,
          },
        },
      },
      orderBy: {
        tanggalTransaksi: "desc",
      },
    });

    return NextResponse.json({
      transaksi,
      role: dbUser.role,
    });
  } catch (error) {
    console.error("GET TRANSAKSI ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data transaksi." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Belum login." },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const berat = Number(body.berat);
    const jenisSampahId = body.jenisSampahId;
    const wilayahId = body.wilayahId;
    const status = body.status || "Menunggu";

    if (!berat || berat <= 0) {
      return NextResponse.json(
        { message: "Berat sampah harus lebih dari 0." },
        { status: 400 }
      );
    }

    if (!jenisSampahId || !wilayahId) {
      return NextResponse.json(
        { message: "Jenis sampah dan wilayah wajib dipilih." },
        { status: 400 }
      );
    }

    let userId = dbUser.id;

    if (dbUser.role === "admin" && body.userId) {
      userId = body.userId;
    }

    const transaksi = await prisma.transaksiSampah.create({
      data: {
        berat,
        status,
        userId,
        jenisSampahId,
        wilayahId,
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
          },
        },
        jenisSampah: {
          select: {
            id: true,
            namaSampah: true,
          },
        },
        wilayah: {
          select: {
            id: true,
            namaWilayah: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Transaksi berhasil ditambahkan.",
        transaksi,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST TRANSAKSI ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menambahkan transaksi." },
      { status: 500 }
    );
  }
}