import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Flujo de Carga de Documentos de Institución E2E (Coordinador)', () => {
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
          name: 'institucion/mocked-e2e-doc.pdf',
          bucket: 'prefeco-eniep-16f05.firebasestorage.app',
          downloadTokens: 'mocked-e2e-token-doc',
        }),
      });
    });

    // Login previo como Coordinador de la Escuela (prueba)
    await page.goto('/');
    await page.locator('button:has-text("INICIAR SESIÓN")').first().click();
    await page.locator('input[placeholder="usuario_prefeco o correo@ejemplo.com"]').fill('prueba');
    await page.locator('input[placeholder="••••••••"]').fill('Password123!');
    await page.locator('button[type="submit"]:has-text("Iniciar Sesión")').click();
    await page.waitForURL('**/dashboard');
  });

  test('Debería poder cargar y guardar documentos oficiales de la escuela', async ({ page }) => {
    // Navegar a la página de carga de documentos de la escuela
    await page.goto('/dashboard/institucion-documentos');

    // Verificar que estamos en la página
    await expect(page.locator('h1:has-text("Documentos Institucionales")')).toBeVisible();

    // Validar que se detecta la institución asignada en el seed
    await expect(page.locator('text=Institución: Preparatoria Test E2E')).toBeVisible();

    const docPath = path.resolve(__dirname, 'e2e_dummy.pdf');

    // 1. Cargar "Aval de la presidencia nacional"
    await page.locator('div:has-text("Aval de la presidencia nacional") >> input[type="file"]').first().setInputFiles(docPath);

    // Esperar mensaje toast de subida completada
    await expect(page.locator('text=Documento subido correctamente')).toBeVisible();

    // 2. Cargar "Liberación de adeudos (recibo 2026)"
    await page.locator('div:has-text("Liberación de adeudos") >> input[type="file"]').first().setInputFiles(docPath);

    // Esperar mensaje toast de subida completada
    await expect(page.locator('text=Documento subido correctamente')).toBeVisible();

    // 3. Guardar documentos en base de datos
    const saveButton = page.locator('button:has-text("Guardar documentos")');
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Verificar guardado exitoso
    await expect(page.locator('text=Documentos institucionales actualizados')).toBeVisible();
  });
});
