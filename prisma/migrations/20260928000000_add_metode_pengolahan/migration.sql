-- CreateTable
CREATE TABLE "MetodePengolahan" (
    "id" TEXT NOT NULL,
    "namaMetode" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,

    CONSTRAINT "MetodePengolahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampahMetode" (
    "jenisSampahId" TEXT NOT NULL,
    "metodePengolahanId" TEXT NOT NULL,

    CONSTRAINT "SampahMetode_pkey" PRIMARY KEY ("jenisSampahId", "metodePengolahanId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetodePengolahan_namaMetode_key"
ON "MetodePengolahan"("namaMetode");

-- AddForeignKey
ALTER TABLE "SampahMetode"
ADD CONSTRAINT "SampahMetode_jenisSampahId_fkey"
FOREIGN KEY ("jenisSampahId")
REFERENCES "JenisSampah"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampahMetode"
ADD CONSTRAINT "SampahMetode_metodePengolahanId_fkey"
FOREIGN KEY ("metodePengolahanId")
REFERENCES "MetodePengolahan"("id")
ON DELETE CASCADE ON UPDATE CASCADE;