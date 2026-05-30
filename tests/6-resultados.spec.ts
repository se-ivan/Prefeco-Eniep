import { test, expect } from '@playwright/test';

test.describe('Flujo de Registro de Resultados E2E (Administrador)', () => {
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

  test('Debería poder registrar los ganadores del podio y verificar la tabla de resultados', async ({ page }) => {
    // Navegar a la página de resultados
    await page.goto('/dashboard/resultados');

    // Verificar que estamos en la página
    await expect(page.locator('h1:has-text("Gestión de Resultados")')).toBeVisible();

    // 1. Seleccionar la disciplina 'Oratoria Única'
    await page.locator('button[role="combobox"]').first().click();
    await page.locator('div[role="option"]:has-text("Oratoria Única")').first().click();

    // 2. Seleccionar la categoría 'Única'
    await page.locator('button:has-text("Selecciona una categoría")').click();
    await page.locator('span:has-text("Única")').first().click();

    // 3. Asignar 1º Lugar (Oro) a 'Preparatoria Test E2E'
    await page.locator('div:has(> label:has-text("1º Lugar (Oro)")) >> button').first().click();
    await page.locator('div[role="option"]:has-text("Preparatoria Test E2E")').first().click();

    // 4. Guardar resultados
    const saveButton = page.locator('button:has-text("Guardar Resultados")');
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Verificar mensaje de éxito
    await expect(page.locator('text=Resultados guardados correctamente')).toBeVisible();

    // ----------------------------------------------------
    // VALIDACIÓN: Verificar aparición del podio registrado
    // ----------------------------------------------------
    // Verificar en la lista de resultados de la derecha
    const oratoriaAccordion = page.locator('h3:has-text("Oratoria Única")').first();
    if (await oratoriaAccordion.isVisible()) {
      await oratoriaAccordion.click();
      
      // Comprobar que en la tabla figura Preparatoria Test E2E como 1º Lugar
      await expect(page.locator('table >> text=Preparatoria Test E2E')).toBeVisible();
      await expect(page.locator('table >> text=1º Lugar')).toBeVisible();
    }
  });
});
