import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { Historia } from '../components/Historia';
import { ModeloEducativo } from '../components/ModeloEducativo';
import { CafeteriaMenu } from '../components/CafeteriaMenu';
import { Galeria } from '../components/Galeria';
import { Planteles } from '../components/Planteles';
import { Contacto } from '../components/Contacto';
import { Footer } from '../components/Footer';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const institucionesData = await prisma.institucion.findMany({
    where: {
      usuariosResponsables: {
        none: {
          username: 'prueba'
        }
      }
    },
    include: {
      usuariosResponsables: {
        select: { email: true }
      }
    },
    orderBy: {
      nombre: 'asc'
    }
  });

  const planteles = institucionesData.map(inst => {
    let email: string | undefined = undefined;
    if (inst.usuariosResponsables && inst.usuariosResponsables.length > 0) {
      if (!inst.usuariosResponsables[0].email.endsWith('@localhost') && !inst.usuariosResponsables[0].email.endsWith('@local.eniep')) {
         email = inst.usuariosResponsables[0].email;
      }
    }
    
    return {
      id: inst.id,
      name: inst.nombre,
      location: inst.municipio || inst.estado, 
      phone: inst.telefono || undefined,
      email: email
    };
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <CafeteriaMenu />
      <Galeria />
      <Planteles instituciones={planteles} />
      <Contacto />
      <Footer />
    </div>
  );
}
