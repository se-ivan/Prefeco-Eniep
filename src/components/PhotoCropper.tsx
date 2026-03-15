"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import getCroppedImg from "@/lib/cropImage";
import { ImageIcon, CameraIcon, UploadIcon, Loader2 } from "lucide-react";

interface PhotoCropperProps {
  onImageCropped: (file: File) => void;
  aspect?: number; 
  title?: string;
}

export function PhotoCropper({
  onImageCropped,
  aspect = 3 / 4, // aspect ratio rectangular tamaño infantil (generalmente 2.5x3 o 3x4)
  title = "Ajustar Foto"
}: PhotoCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      setIsCropping(true);
      const croppedImageFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0
      );
      if (croppedImageFile) {
        onImageCropped(croppedImageFile);
        setImageSrc(null); // Close the cropper
      }
    } catch (e) {
      console.error(e);
      alert("Error al recortar la imagen");
    } finally {
      setIsCropping(false);
    }
  }, [imageSrc, croppedAreaPixels, onImageCropped]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors">
          <UploadIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>Subir / Tomar Foto (Tamaño Infantil)</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
            // En móviles esto sugiere a veces abrir la cámara, pero para forzarla se usaría capture="environment" o "user". 
            // Lo dejamos sin "capture" para dar la opción de galería O cámara en iOS/Android.
          />
        </label>
      </div>

      <Dialog open={!!imageSrc} onOpenChange={(open) => { if (!open) setImageSrc(null); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64 sm:h-80 bg-gray-900 rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={true}
              />
            )}
          </div>
          <div className="px-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Zoom</h4>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val) => setZoom(val[0])}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageSrc(null)}>
              Cancelar
            </Button>
            <Button onClick={showCroppedImage} disabled={isCropping}>
              {isCropping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aplicar Recorte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
}