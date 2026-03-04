-- CreateTable
CREATE TABLE "public"."instituciones" (
    "id" SERIAL NOT NULL,
    "cct" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "zona_escolar" TEXT NOT NULL,
    "url_logo" TEXT,

    CONSTRAINT "instituciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instituciones_cct_key" ON "public"."instituciones"("cct");
