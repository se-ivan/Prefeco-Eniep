import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ensureFirebaseUploadSession, getFirebaseStorage } from "@/lib/firebase-storage";

const ALLOWED_DOC_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_DOC_BYTES = 10 * 1024 * 1024;

type ParticipantDocumentCategory =
  | "credencial"
  | "carta-responsiva-tutor"
  | "historial-medico"
  | "acta-nacimiento";

type PersonalApoyoDocumentCategory =
  | "curp"
  | "identificacion-oficial"
  | "comprobante-domicilio"
  | "carta-antecedentes";

type UploadDocumentResult = {
  url: string;
  storagePath: string;
};

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 80);
}

function getExtension(file: File, safeName: string) {
  if (safeName.includes(".")) {
    const ext = safeName.split(".").pop();
    if (ext) return ext;
  }

  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function validateDocument(file: File) {
  if (!ALLOWED_DOC_MIME_TYPES.includes(file.type)) {
    throw new Error("Formato no valido. Usa PDF, JPG, PNG o WEBP");
  }

  if (file.size > MAX_DOC_BYTES) {
    throw new Error("El archivo excede 10MB");
  }
}

export async function uploadParticipantDocumentToFirebase(
  file: File,
  category: ParticipantDocumentCategory
): Promise<UploadDocumentResult> {
  validateDocument(file);

  await ensureFirebaseUploadSession();
  const storage = getFirebaseStorage();

  const safeName = sanitizeFileName(file.name || "documento");
  const extension = getExtension(file, safeName);
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const storagePath = `participante-documentos/${category}/${fileName}`;

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
    customMetadata: {
      originalName: safeName,
      source: "prefeco-dashboard",
      documentCategory: category,
    },
  });

  const url = await getDownloadURL(storageRef);
  return { url, storagePath };
}

export async function uploadPersonalApoyoDocumentToFirebase(
  file: File,
  category: PersonalApoyoDocumentCategory
): Promise<UploadDocumentResult> {
  validateDocument(file);

  await ensureFirebaseUploadSession();
  const storage = getFirebaseStorage();

  const safeName = sanitizeFileName(file.name || "documento");
  const extension = getExtension(file, safeName);
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const storagePath = `personal-apoyo-documentos/${category}/${fileName}`;

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
    customMetadata: {
      originalName: safeName,
      source: "prefeco-dashboard",
      documentCategory: category,
    },
  });

  const url = await getDownloadURL(storageRef);
  return { url, storagePath };
}
