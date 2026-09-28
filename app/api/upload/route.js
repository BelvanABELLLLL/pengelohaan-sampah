import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          message: "File tidak ditemukan.",
        },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "File harus berupa gambar JPG, PNG, WEBP, atau GIF.",
        },
        { status: 400 }
      );
    }

    // Batas ukuran 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          message: "Ukuran foto maksimal 5 MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ambil ekstensi asli
    const extension =
      path.extname(file.name) || ".jpg";

    // Nama file unik
    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}${extension}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    const filePath = path.join(
      uploadDir,
      fileName
    );

    await writeFile(filePath, buffer);

    return NextResponse.json({
      message: "Upload berhasil.",
      imageUrl: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        message: "Gagal mengupload foto.",
      },
      { status: 500 }
    );
  }
}