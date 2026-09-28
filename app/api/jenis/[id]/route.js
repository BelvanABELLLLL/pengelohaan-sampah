import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;

    const body = await req.json();

    const metodeIds = Array.isArray(
      body.metodeIds
    )
      ? body.metodeIds
      : [];


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


    const data =
      await prisma.$transaction(
        async (tx) => {

          // Update jenis sampah
          const jenis =
            await tx.jenisSampah.update({
              where: {
                id,
              },

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
          // HAPUS RELASI LAMA
          // ==========================
          await tx.sampahMetode.deleteMany(
            {
              where: {
                jenisSampahId: id,
              },
            }
          );


          // ==========================
          // BUAT RELASI BARU
          // ==========================
          if (
            metodeIds.length > 0
          ) {

            await tx.sampahMetode.createMany(
              {
                data: metodeIds.map(
                  (metodeId) => ({
                    jenisSampahId: id,

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


    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "PUT /api/jenis/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal mengubah data jenis sampah.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================
// DELETE
// ==========================
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Cek apakah jenis sampah masih
    // digunakan oleh laporan
    const jumlahLaporan =
      await prisma.laporanSampah.count({
        where: {
          jenisSampahId: id,
        },
      });

    // Jika masih digunakan
    if (jumlahLaporan > 0) {
      return NextResponse.json(
        {
          error:
            `Jenis sampah tidak dapat dihapus karena masih digunakan oleh ${jumlahLaporan} laporan sampah.`,
        },
        {
          status: 409,
        }
      );
    }

    // Kalau tidak digunakan laporan,
    // aman untuk dihapus
    await prisma.jenisSampah.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message:
        "Data jenis sampah berhasil dihapus.",
    });

  } catch (error) {
    console.error(
      "DELETE /api/jenis/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal menghapus data jenis sampah.",
      },
      {
        status: 500,
      }
    );
  }
}