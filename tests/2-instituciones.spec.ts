import { test, expect } from '@playwright/test';

test.describe('Flujo de Registro de Instituciones E2E (Administrador)', () => {
  test.beforeEach(async ({ page }) => {
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

    // Login como administrador
    await page.goto('/');
    await page.locator('button:has-text("INICIAR SESIÓN")').first().click();
    await page.locator('input[placeholder="usuario_prefeco o correo@ejemplo.com"]').fill('admin_test');
    await page.locator('input[placeholder="••••••••"]').fill('Password123!');
    await page.locator('button[type="submit"]:has-text("Iniciar Sesión")').click();
    await page.waitForURL('**/dashboard');
  });

  test('Debería poder registrar una nueva institución educativa y visualizarla en el listado', async ({ page }) => {
    // Navegar al formulario de registro de institución
    await page.goto('/dashboard/instituciones/registro');

    // Verificar que estamos en la página
    await expect(page.locator('h2:has-text("Registro de Institución")')).toBeVisible();

    const uniqueNumber = Math.floor(Math.random() * 90000 + 10000);
    const mockCct = `15SBC${uniqueNumber}Z`;
    const mockSchoolName = `Preparatoria E2E N° ${uniqueNumber}`;

    // Esperar a que la página e inputs se inicialicen por completo (evita condiciones de carrera en SPAs)
    await page.waitForTimeout(1000);

    // Rellenar formulario con foco explícito por clic
    const nameInput = page.locator('input[placeholder="Ej: Escuela Preparatoria Federal"]');
    await nameInput.click();
    await nameInput.fill(mockSchoolName);

    const directorInput = page.locator('input[id="nombreDirector"]');
    await directorInput.click();
    await directorInput.fill('Director Juárez E2E');

    const cctInput = page.locator('input[id="cct"]');
    await cctInput.click();
    await cctInput.fill(mockCct);

    const municipioInput = page.locator('input[id="municipio"]');
    await municipioInput.click();
    await municipioInput.fill('Toluca');

    // Manejar el selector de Estado (Radix UI Select)
    await page.locator('button:has(span:has-text("Selecciona una opción"))').click();
    // Seleccionar 'Estado de México'
    await page.locator('div[role="option"]:has-text("Estado de México")').click();

    // Registrar
    const submitButton = page.locator('button[type="submit"]:has-text("Registrar")');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // ----------------------------------------------------
    // VALIDACIÓN: Redirección al listado general de escuelas
    // ----------------------------------------------------
    await page.waitForURL('**/dashboard/instituciones');
    await expect(page).toHaveURL(/.*instituciones/);

    // Buscar la escuela recién creada
    const searchInput = page.locator('input[placeholder*="Buscar por"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill(mockSchoolName);
      await page.waitForTimeout(1000); // Debounce delay
    }

    // Verificar que se visualiza la escuela
    await expect(page.locator(`text=${mockSchoolName}`).first()).toBeVisible();
    await expect(page.locator(`text=${mockCct}`).first()).toBeVisible();
    await expect(page.locator('text=Toluca').first()).toBeVisible();
  });
});
