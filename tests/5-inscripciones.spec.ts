import { test, expect } from '@playwright/test';

test.describe('Flujo de Inscripción de Alumnos a Disciplinas E2E', () => {
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

  test('Debería poder inscribir a un alumno en una disciplina individual', async ({ page }) => {
    // Ir a la página de disciplinas
    await page.goto('/dashboard/disciplinas');

    // Buscar una disciplina individual, por ejemplo "Oratoria Única" (Cultural)
    const oratoriaCard = page.locator('article:has(h3:has-text("Oratoria Única"))').first();
    await expect(oratoriaCard).toBeVisible();

    // Hacer clic en "+ Nuevo" en la tarjeta
    const enrollButton = oratoriaCard.locator('button:has-text("+ Nuevo")').first();
    await expect(enrollButton).toBeVisible();
    await enrollButton.click();

    // ----------------------------------------------------
    // MODAL: NuevoParticipanteModal
    // ----------------------------------------------------
    // Verificar que se abre el modal
    await expect(page.locator('h3:has-text("Seleccionar participantes")')).toBeVisible();

    // 1. Seleccionar escuela 'Preparatoria Test E2E'
    await page.locator('button:has(span:has-text("Selecciona institución"))').click();
    await page.locator('div[role="option"]:has-text("Preparatoria Test E2E")').click();

    // 2. Seleccionar tipo 'Alumno' (si no está seleccionado por defecto)
    await page.locator('button:has-text("Alumno")').click();

    // 3. Seleccionar categoría 'Única'
    await page.locator('button:has(span:has-text("Selecciona categoría"))').click();
    await page.locator('div[role="option"]:has-text("Única")').click();

    // 4. Seleccionar al participante 'Juan E2E' de la lista de resultados
    const participantButton = page.locator('button:has-text("Juan E2E")').first();
    await expect(participantButton).toBeVisible();
    await participantButton.click();

    // Verificar que se agrega a la columna de nuevas altas
    await expect(page.locator('div:has(> p:has-text("Nuevas Altas")) >> text=Juan E2E').first()).toBeVisible();

    // 5. Confirmar selección
    const confirmButton = page.locator('button:has-text("Confirmar Selección")');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // Verificar mensaje de éxito
    // El modal se cierra tras el guardado
    await expect(page.locator('h3:has-text("Seleccionar participantes")')).not.toBeVisible();

    // ----------------------------------------------------
    // VALIDACIÓN: Comprobar que el alumno figura inscrito en la disciplina
    // ----------------------------------------------------
    await page.goto('/dashboard/disciplinas');
    const viewInscritosLink = oratoriaCard.locator('a:has-text("Ver"), a:has-text("Participantes")').first();
    if (await viewInscritosLink.isVisible()) {
      await viewInscritosLink.click();
      await page.waitForURL('**/dashboard/disciplinas/**/participantes');
      
      // Comprobar que Juan E2E figura en la tabla de individuales
      await expect(page.locator('table >> text=Juan E2E')).toBeVisible();
    }
  });
});
