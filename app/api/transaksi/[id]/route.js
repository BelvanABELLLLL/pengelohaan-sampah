import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Belum login." },
        { status: 401 }
      );
    }

    const { id } = await params;

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

    const transaksi = await prisma.transaksiSampah.findUnique({
      where: { id },
    });

    if (!transaksi) {
      return NextResponse.json(
        { message: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    if (
      dbUser.role !== "admin" &&
      transaksi.userId !== dbUser.id
    ) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses." },
        { status: 403 }
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

    const data = {
      berat,
      jenisSampahId,
      wilayahId,
      status,
    };

    // Admin boleh mengubah pemilik transaksi.
    if (dbUser.role === "admin" && body.userId) {
      data.userId = body.userId;
    }

    const updated = await prisma.transaksiSampah.update({
      where: { id },
      data,
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

    return NextResponse.json({
      message: "Transaksi berhasil diperbarui.",
      transaksi: updated,
    });
  } catch (error) {
    console.error("PUT TRANSAKSI ERROR:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui transaksi." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Belum login." },
        { status: 401 }
      );
    }

    const { id } = await params;

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

    const transaksi = await prisma.transaksiSampah.findUnique({
      where: { id },
    });

    if (!transaksi) {
      return NextResponse.json(
        { message: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    if (
      dbUser.role !== "admin" &&
      transaksi.userId !== dbUser.id
    ) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses." },
        { status: 403 }
      );
    }

    await prisma.transaksiSampah.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Transaksi berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE TRANSAKSI ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus transaksi." },
      { status: 500 }
    );
  }
}