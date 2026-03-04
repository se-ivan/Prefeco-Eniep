-- CreateTable
CREATE TABLE "public"."personal_apoyo" (
    "id" SERIAL NOT NULL,
    "institucionId" INTEGER NOT NULL,
    "curp" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "contacto_emergencia_nombre" TEXT,
    "contacto_emergencia_telefono" TEXT,
    "doc_curp" BOOLEAN NOT NULL DEFAULT false,
    "doc_identificacion_oficial" BOOLEAN NOT NULL DEFAULT false,
    "doc_comprobante_domicilio" BOOLEAN NOT NULL DEFAULT false,
    "doc_carta_antecedentes" BOOLEAN NOT NULL DEFAULT false,
    "estatus" "public"."Estatus" NOT NULL,

    CONSTRAINT "personal_apoyo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."personal_apoyo"
ADD CONSTRAINT "personal_apoyo_institucionId_fkey"
FOREIGN KEY ("institucionId") REFERENCES "public"."instituciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
