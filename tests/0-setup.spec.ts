import { test, expect } from '@playwright/test';

test.describe('E2E Setup & Database Seeding', () => {
  test('Debería inicializar y poblar la base de datos Neon de pruebas a través de la API', async ({ request }) => {
    console.log('Poblando base de datos Neon de pruebas...');
    
    // Llamar al endpoint de seeding local que creamos
    const response = await request.get('/api/seed-e2e');
    
    // Verificar que responda con éxito
    expect(response.ok()).toBeTruthy();
    
    const result = await response.json();
    expect(result.success).toBe(true);
    
    console.log('Base de datos Neon poblada correctamente para las pruebas E2E.');
  });
});
