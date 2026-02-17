import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { Historia } from '../components/Historia';
import { ModeloEducativo } from '../components/ModeloEducativo';
import { Galeria } from '../components/Galeria';
import { Planteles } from '../components/Planteles';
import { Contacto } from '../components/Contacto';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Historia />
      <ModeloEducativo />
      <Galeria />
      <Planteles />
      <Contacto />
      <Footer />
    </div>
  );
}
