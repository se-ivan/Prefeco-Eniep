import HotelesView from "@/components/HotelesView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoteles - ENIEP PREFECO",
  description: "Conoce los hoteles sede para el ENIEP 2026 y sus tarifas preferenciales.",
};

export default function HotelesPage() {
  return <HotelesView />;
}