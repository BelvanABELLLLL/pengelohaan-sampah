import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ==========================
// GET
// ==========================
export async function GET() {
  try {
    const data = await prisma.jenisSampah.findMany({
      include: {
        metode: {
          include: {
            metodePengolahan: true,
          },
        },
      },

      orderBy: {
        namaSampah: "asc",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "GET /api/jenis error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal mengambil data jenis sampah.",
      },
      {
        status: 500,
      }
    );
  }
}


// ==========================
// POST
// ==========================
export async function POST(req) {
  try {
    const body = await req.json();

    const metodeIds = Array.isArray(
      body.metodeIds
    )
      ? body.metodeIds
      : [];


    // ==========================
    // VALIDASI
    // ==========================
    if (
      !body.namaSampah?.trim() ||
      !body.jenisSampah ||
      !body.statusSampah
    ) {
      return NextResponse.json(
        {
          error:
            "Semua data jenis sampah wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }


    // ==========================
    // TRANSACTION
    // ==========================
    const data =
      await prisma.$transaction(
        async (tx) => {

          // Buat jenis sampah
          const jenis =
            await tx.jenisSampah.create({
              data: {
                namaSampah:
                  body.namaSampah.trim(),

                jenisSampah:
                  body.jenisSampah,

                statusSampah:
                  body.statusSampah,
              },
            });


          // ==========================
          // BUAT RELASI M:N
          // ==========================
          if (
            metodeIds.length > 0
          ) {

            await tx.sampahMetode.createMany(
              {
                data: metodeIds.map(
                  (metodeId) => ({
                    jenisSampahId:
                      jenis.id,

                    metodePengolahanId:
                      metodeId,
                  })
                ),

                skipDuplicates: true,
              }
            );

          }


          return jenis;
        }
      );


    return NextResponse.json(
      data,
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "POST /api/jenis error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal menambahkan data jenis sampah.",
      },
      {
        status: 500,
      }
    );
  }
}