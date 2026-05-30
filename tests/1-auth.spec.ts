import { test, expect } from '@playwright/test';

test.describe('Portal de Autenticación E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Simular que estamos en abril de 2026 para saltar la restricción del countdown sin congelar los temporizadores de animación
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

    await page.goto('/');
  });

  test('Debería validar el flujo completo de autenticación y errores', async ({ page }) => {
    // 1. Abrir modal de inicio de sesión
    const loginButton = page.locator('button:has-text("INICIAR SESIÓN")').first();
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // Validar que el modal está abierto
    const welcomeHeader = page.locator('h2:has-text("Bienvenido")');
    await expect(welcomeHeader).toBeVisible();

    // 2. Intentar ingresar con credenciales erróneas
    await page.locator('input[placeholder="usuario_prefeco o correo@ejemplo.com"]').fill('wrong_user');
    await page.locator('input[placeholder="••••••••"]').fill('wrong_password');
    await page.locator('button[type="submit"]:has-text("Iniciar Sesión")').click();

    // Verificar que aparece el bloque de error destructivo de Better Auth
    const errorMessage = page.locator('p.text-destructive');
    await expect(errorMessage).toBeVisible();

    // 3. Validar formulario de restablecimiento de contraseña
    const resetLink = page.locator('button:has-text("Restablecer Contraseña")');
    await expect(resetLink).toBeVisible();
    await resetLink.click();

    // Verificar formulario de restablecimiento
    const resetHeader = page.locator('h2:has-text("Restablecer Contraseña")');
    await expect(resetHeader).toBeVisible();

    // Volver al login
    const backToLogin = page.locator('button:has-text("Volver al inicio de sesión")');
    await expect(backToLogin).toBeVisible();
    await backToLogin.click();
    await expect(welcomeHeader).toBeVisible();

    // 4. Iniciar sesión correctamente con el usuario administrador de pruebas (admin_test)
    await page.locator('input[placeholder="usuario_prefeco o correo@ejemplo.com"]').fill('admin_test');
    await page.locator('input[placeholder="••••••••"]').fill('Password123!');
    await page.locator('button[type="submit"]:has-text("Iniciar Sesión")').click();

    // 5. Verificar redirección al Dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);

    // Verificar que el sidebar contiene el nombre del administrador
    const sidebarName = page.locator('aside >> text=Administrador Test E2E');
    await expect(sidebarName).toBeVisible();

    // 6. Cerrar Sesión y retornar a la landing page pública
    const logoutButton = page.locator('button:has-text("Cerrar Sesión")');
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // Validar redirección de retorno
    await page.waitForURL('http://localhost:3000/');
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
