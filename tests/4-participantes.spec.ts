import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Flujo de Registro de Participantes E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Capture and print browser console logs for E2E debugging
    page.on('console', msg => console.log('PAGE CONSOLE:', msg.text()));

    // Simular que estamos en abril de 2026 sin congelar los temporizadores
    await page.addInitScript(() => {
      const mockDate = new Date('2026-04-15T10:00:00-06:00');
      const OriginalDate = Date;
      // @ts-ignore
      globalThis.Date = class extends OriginalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockDate);
          } else {
            // @ts-ignore
            super(...args);
          }
        }
        static now() {
          return mockDate.getTime();
        }
      };

      // Mock naturalWidth/naturalHeight on HTMLImageElement prototype for client-side aspect ratio check bypass
      Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', { get: () => 300 });
      Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', { get: () => 400 });
    });

    // Interceptar y mockear llamadas a Firebase Auth
    await page.route('**/identitytoolkit.googleapis.com/**', async (route) => {
      const url = route.request().url();
      if (url.includes('signUp')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            kind: 'identitytoolkit#SignupNewUserResponse',
            idToken: 'mock-id-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: '3600',
            localId: 'mock-local-id',
          }),
        });
      } else if (url.includes('lookup')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            kind: 'identitytoolkit#GetAccountInfoResponse',
            users: [
              {
                localId: 'mock-local-id',
                createdAt: '1740000000000',
                lastLoginAt: '1740000000000',
                passwordUpdatedAt: 1740000000000,
              }
            ]
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        });
      }
    });

    // Interceptar y mockear llamadas a Firebase Storage
    await page.route('**/firebasestorage.googleapis.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'participante/mocked-e2e-photo.jpg',
          bucket: 'prefeco-eniep-16f05.firebasestorage.app',
          downloadTokens: 'mocked-e2e-token',
        }),
      });
    });

    // Login previo como administrador
    await page.goto('/');
    await page.locator('button:has-text("INICIAR SESIÓN")').first().click();
    await page.locator('input[placeholder="usuario_prefeco o correo@ejemplo.com"]').fill('admin_test');
    await page.locator('input[placeholder="••••••••"]').fill('Password123!');
    await page.locator('button[type="submit"]:has-text("Iniciar Sesión")').click();
    await page.waitForURL('**/dashboard');
  });

  test('Debería poder registrar un alumno a través del wizard de 4 pasos', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('/dashboard/participantes');

    // Verificar que estamos en el formulario
    await expect(page.locator('h2:has-text("Registro de Participante")')).toBeVisible();

    // ----------------------------------------------------
    // PASO 1: Datos del Alumno
    // ----------------------------------------------------
    // Seleccionar escuela de pruebas
    await page.selectOption('select[name="institucionId"]', { label: 'Preparatoria Test E2E' });

    // Cargar la fotografía
    const photoPath = path.resolve(__dirname, 'e2e_student_photo.png');
    await page.locator('input[type="file"][accept*="image"]').setInputFiles(photoPath);

    // Ajustar cropper y aplicar
    const applyCropButton = page.locator('button:has-text("Aplicar Recorte")');
    await expect(applyCropButton).toBeVisible();
    await applyCropButton.click();

    // Validar que la foto se cargó y muestra vista previa
    await expect(page.locator('text=Quitar fotografia')).toBeVisible();

    // Rellenar formulario principal
    await page.locator('input[name="nombres"]').fill('Juan E2E');
    await page.locator('input[name="apellidoPaterno"]').fill('Pérez');
    await page.locator('input[name="apellidoMaterno"]').fill('García');
    await page.locator('input[name="matricula"]').fill('202699999');
    await page.locator('input[name="curp"]').fill('GAPL050815HDFRPNA0');
    await page.locator('input[name="semestre"]').fill('4');
    await page.locator('input[name="fechaNacimiento"]').fill('2008-08-15');
    await page.selectOption('select[name="genero"]', 'MASCULINO');

    // Siguiente
    await page.locator('button:has-text("Siguiente")').click();

    // ----------------------------------------------------
    // PASO 2: Datos Médicos
    // ----------------------------------------------------
    await page.locator('input[name="tipoSangre"]').fill('O+');
    await page.locator('input[name="alergias"]').fill('Polen');
    await page.locator('input[name="padecimientos"]').fill('Ninguno');
    await page.locator('input[name="medicamentos"]').fill('Ninguno');
    await page.locator('input[name="contactoEmergenciaNombre"]').fill('Papá E2E');
    await page.locator('input[name="contactoEmergenciaTelefono"]').fill('5512345678');

    await page.locator('button:has-text("Siguiente")').click();

    // ----------------------------------------------------
    // PASO 3: Tutor Legal
    // ----------------------------------------------------
    await page.locator('input[name="tutorNombreCompleto"]').fill('Tutor E2E');
    await page.locator('input[name="tutorParentesco"]').fill('Padre');
    await page.locator('input[name="tutorTelefono"]').fill('5512345678');
    await page.locator('input[name="tutorEmail"]').fill('tutor@e2e.com');
    await page.locator('input[name="tutorDireccion"]').fill('Calle Falsa 123');

    await page.locator('button:has-text("Siguiente")').click();

    // ----------------------------------------------------
    // PASO 4: Documentación
    // ----------------------------------------------------
    // Subir acta de nacimiento (mock)
    const docPath = path.resolve(__dirname, 'e2e_dummy.pdf');
    
    // Acta de nacimiento input
    await page.locator('div:has-text("Acta de nacimiento") >> input[type="file"]').first().setInputFiles(docPath);

    // Registrar Alumno
    const finishButton = page.locator('button:has-text("Finalizar Registro")');
    await expect(finishButton).toBeVisible();
    await finishButton.click();

    // ----------------------------------------------------
    // VALIDACIÓN: Comprobar redirección y aparición en tabla
    // ----------------------------------------------------
    await page.waitForURL('**/dashboard/participantes/lista');
    await expect(page).toHaveURL(/.*participantes\/lista/);

    // Filtrar/buscar en la lista de alumnos
    const searchInput = page.locator('input[placeholder*="Buscar por nombre, CURP o matrícula"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Juan E2E');
      await page.waitForTimeout(1000); // Wait for debounce
    }

    // Verificar que se muestra la fila/tarjeta
    await expect(page.locator('text=Juan E2E').first()).toBeVisible();
    await expect(page.locator('text=Pérez').first()).toBeVisible();
    await expect(page.locator('text=202699999').first()).toBeVisible();
  });
});
