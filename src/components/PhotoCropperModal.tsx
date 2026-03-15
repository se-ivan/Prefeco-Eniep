"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { Loader2 } from "lucide-react";

interface PhotoCropperModalProps {
  file: File | null;
  onClose: () => void;
  onCropComplete: (file: File) => void;
  aspect?: number; 
  title?: string;
}

export function PhotoCropperModal({
  file,
  onClose,
  onCropComplete,
  aspect = 3 / 4, 
  title = "Ajustar Fotografía"
}: PhotoCropperModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageSrc(null);
    }
  }, [file]);

  const handleCropComplete = useCallback((croppedArea: any, currentCroppedAreaPixels: any) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  }, []);

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
        onCropComplete(croppedImageFile);
      }
    } catch (e) {
      console.error(e);
      alert("Error al recortar la imagen");
    } finally {
      setIsCropping(false);
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete]);

  return (
    <Dialog open={!!imageSrc} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-80 sm:h-96 bg-gray-900 rounded-md overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
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
          <Button variant="outline" onClick={onClose} disabled={isCropping}>
            Cancelar
          </Button>
          <Button onClick={showCroppedImage} disabled={isCropping} className="bg-[#08677a] hover:bg-teal-800 text-white">
            {isCropping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Aplicar Recorte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}