import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function GET(request) {
  try {
    // Ambil token dari cookie
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Belum login." },
        { status: 401 }
      );
    }

    // Verifikasi JWT
    const { payload } = await jwtVerify(
      token,
      secret
    );

    const currentUserId = payload.userId;

    // Ambil data pengguna TANPA password
    const data = await prisma.user.findMany({
      orderBy: {
        nama: "asc",
      },

      select: {
        id: true,
        nama: true,
        tanggalLahir: true,
        email: true,
        noHp: true,
      },
    });

    // Tandai akun yang sedang login
    const hasil = data.map((user) => ({
      ...user,
      isSelf: user.id === currentUserId,
    }));

    return NextResponse.json(hasil);
  } catch (error) {
    console.error("PENGGUNA GET ERROR:", error);

    return NextResponse.json(
      { message: "Token tidak valid atau sudah expired." },
      { status: 401 }
    );
  }
}