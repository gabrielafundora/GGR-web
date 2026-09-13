import { test, expect } from "@playwright/test";

// Antes de correr esto, siembra un admin de prueba con credenciales fijas
// (ver README.md, sección "Verificación / tests end-to-end"):
//   SEED_ADMIN_EMAIL="e2e-admin@example.com" SEED_ADMIN_PASSWORD="TestAdmin123!" npx tsx prisma/seed.ts
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@example.com";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "TestAdmin123!";

test.describe("Páginas públicas", () => {
  test("inicio carga con el hero y libros destacados", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await page.screenshot({ path: "test-results/screenshots/home.png", fullPage: true });
  });

  test("catálogo lista los libros sembrados", async ({ page }) => {
    const response = await page.goto("/catalogo");
    expect(response?.status()).toBe(200);
    await expect(page.getByText("El jardín de las ausencias")).toBeVisible();
    await page.screenshot({ path: "test-results/screenshots/catalogo.png", fullPage: true });
  });

  test("detalle de libro enlaza a Amazon", async ({ page }) => {
    await page.goto("/catalogo/el-jardin-de-las-ausencias");
    const link = page.getByRole("link", { name: "Ver en Amazon" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", /amazon\.com/);
  });

  test("artículos lista y el detalle renderiza markdown", async ({ page }) => {
    await page.goto("/articulos");
    await expect(page.getByRole("heading", { name: "Sobre el oficio de escribir" })).toBeVisible();

    await page.goto("/articulos/sobre-el-oficio-de-escribir");
    await expect(page.locator("h1")).toContainText("Sobre el oficio de escribir");
    await expect(page.locator("article h2").first()).toBeVisible();
    await page.screenshot({ path: "test-results/screenshots/articulo.png", fullPage: true });
  });

  test("cursos y talleres muestra el link de más información", async ({ page }) => {
    await page.goto("/cursos");
    const link = page.getByRole("link", { name: "Más información" }).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await page.screenshot({ path: "test-results/screenshots/cursos.png", fullPage: true });
  });

  test("sobre-mi muestra la biografía", async ({ page }) => {
    await page.goto("/sobre-mi");
    await expect(page.locator("h1")).toContainText("Sobre la autora");
    await page.screenshot({ path: "test-results/screenshots/sobre-mi.png", fullPage: true });
  });
});

test.describe("Admin", () => {
  test("redirige a login sin sesión", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login con credenciales inválidas muestra error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Correo").fill(ADMIN_EMAIL);
    await page.getByLabel("Contraseña").fill("clave-incorrecta");
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page.getByText("Correo o contraseña incorrectos.")).toBeVisible();
  });

  test("login válido entra al panel", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Correo").fill(ADMIN_EMAIL);
    await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Panel de administrador" })).toBeVisible();
  });

  test("CRUD completo de un libro", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Correo").fill(ADMIN_EMAIL);
    await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    // Crear
    await page.goto("/admin/libros/nuevo");
    await page.getByLabel("Slug (URL)").fill("libro-de-prueba-e2e");
    await page.getByLabel("Título", { exact: true }).fill("Libro de prueba E2E");
    await page.getByLabel("Descripción / sinopsis").fill("Descripción de prueba para el test end-to-end.");
    await page.getByLabel("Portada").fill("/images/books/book-1.svg");
    await page.getByLabel("Link a Amazon").fill("https://www.amazon.com/dp/E2ETEST");
    await page.getByRole("button", { name: "Guardar libro" }).click();
    await expect(page).toHaveURL(/\/admin\/libros$/);
    await expect(page.getByText("Libro de prueba E2E")).toBeVisible();

    // Verificar en el sitio público
    await page.goto("/catalogo");
    await expect(page.getByText("Libro de prueba E2E")).toBeVisible();

    // Editar
    await page.goto("/admin/libros");
    await page.getByRole("row", { name: /Libro de prueba E2E/ }).getByText("Editar").click();
    await page.getByLabel("Título", { exact: true }).fill("Libro de prueba E2E (editado)");
    await page.getByRole("button", { name: "Guardar libro" }).click();
    await expect(page).toHaveURL(/\/admin\/libros$/);
    await expect(page.getByText("Libro de prueba E2E (editado)")).toBeVisible();

    // Borrar
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .getByRole("row", { name: /Libro de prueba E2E \(editado\)/ })
      .getByRole("button", { name: "Eliminar" })
      .click();
    await expect(page).toHaveURL(/\/admin\/libros$/);
    await expect(page.getByText("Libro de prueba E2E (editado)")).toHaveCount(0);
  });

  test("editar metadatos de Inicio actualiza el <title> público", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Correo").fill(ADMIN_EMAIL);
    await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/admin/metadatos");
    const uniqueTitle = `Título de prueba E2E ${Date.now()}`;
    const homeForm = page.locator("form", { has: page.locator('input[value="home"]') });
    await homeForm.getByLabel("Title (título de la pestaña)").fill(uniqueTitle);
    await homeForm.getByRole("button", { name: "Guardar" }).click();
    await expect(homeForm.getByText("Metadatos guardados.")).toBeVisible();

    await page.goto("/");
    await expect(page).toHaveTitle(new RegExp(uniqueTitle));
  });
});
