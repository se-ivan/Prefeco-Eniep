import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ensureFirebaseUploadSession, getFirebaseStorage } from "@/lib/firebase-storage";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

type UploadCategory = "participante" | "personal-apoyo" | "institucion";

type UploadResult = {
  url: string;
  storagePath: string;
};

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 60);
}

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      URL.revokeObjectURL(objectUrl);
      resolve({ width, height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen seleccionada"));
    };

    img.src = objectUrl;
  });
}

export async function validateImageForCategory(file: File, category: UploadCategory) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Formato no valido. Usa JPG, PNG o WEBP");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("La imagen excede 3MB");
  }

  const { width, height } = await readImageSize(file);

  if (category === "institucion") {
    if (width < 200 || height < 200) {
      throw new Error("El logo debe medir al menos 200x200 px");
    }
    return;
  }

  // Formato infantil: vertical con proporcion aproximada 3:4
  const ratio = width / height;
  const targetRatio = 3 / 4;
  const tolerance = 0.08;

  if (height <= width) {
    throw new Error("La fotografia debe ser vertical (alto mayor al ancho)");
  }

  if (Math.abs(ratio - targetRatio) > tolerance) {
    throw new Error("La fotografia debe tener proporcion infantil aproximada 3:4");
  }

  if (width < 300 || height < 400) {
    throw new Error("La fotografia debe medir al menos 300x400 px");
  }
}

export async function uploadImageToFirebase(file: File, category: UploadCategory): Promise<UploadResult> {
  await validateImageForCategory(file, category);
  await ensureFirebaseUploadSession();
  const storage = getFirebaseStorage();

  const safeName = sanitizeFileName(file.name || "imagen.jpg");
  const extension = safeName.includes(".") ? safeName.split(".").pop() : "jpg";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const storagePath = `${category}/${fileName}`;

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
    customMetadata: {
      originalName: safeName,
      source: "prefeco-dashboard",
    },
  });

  const url = await getDownloadURL(storageRef);
  return { url, storagePath };
}
