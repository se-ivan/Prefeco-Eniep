# Prueba de Concepto (PoC)

## Integrantes del Equipo

- David Maldonado Barajas
- Aldo Noé Pacheco Gaona
- José Iván Silva Espinoza
- Axel Yael Zambrano Flores

---

## Descripción

La Prueba de Concepto se desarrolló sobre nuestro proyecto de gestión de eventos deportivos para estudiantes. El objetivo es demostrar los riesgos asociados a la categoría OWASP A01:2021 - Broken Access Control (Control de Acceso Afectado), específicamente enfocada en el CWE-213, que se refiere a la exposición de información sensible debido a la falta de filtrado en el backend (Overfetching).

En este escenario, al consultar el endpoint de usuarios mediante una petición GET, la aplicación utiliza un método `findMany()` sin restricciones. Debido a esta falta de abstracción en la consulta, el servidor responde enviando el objeto completo de la base de datos al cliente, exponiendo en texto plano datos privados como el `username` de inicio de sesión, el campo `role` (que revela los privilegios de la cuenta) y llaves primarias o foráneas como el `institucionId`. Aunque la interfaz gráfica oculte estos campos, cualquier usuario que inspeccione la respuesta de red puede extraerlos.

### Mitigación

Para corregir este fallo, se demuestra en el código que la aplicación debe implementar proyecciones de datos en el backend. El comportamiento correcto consiste en utilizar la propiedad `select` dentro del método `findMany()` del ORM (Prisma), obligando al servidor a retornar única y exclusivamente los campos estrictamente públicos y necesarios para la vista (como el nombre y el correo electrónico), bloqueando desde la raíz cualquier fuga de arquitectura o credenciales del sistema.

---
