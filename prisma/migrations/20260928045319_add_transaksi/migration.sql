-- CreateTable
CREATE TABLE "TransaksiSampah" (
    "id" TEXT NOT NULL,
    "berat" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "tanggalTransaksi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "jenisSampahId" TEXT NOT NULL,
    "wilayahId" TEXT NOT NULL,

    CONSTRAINT "TransaksiSampah_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransaksiSampah" ADD CONSTRAINT "TransaksiSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiSampah" ADD CONSTRAINT "TransaksiSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "JenisSampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiSampah" ADD CONSTRAINT "TransaksiSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
