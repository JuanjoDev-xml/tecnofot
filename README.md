# Tecnofot — sitio nuevo

## Cómo correrlo en tu máquina

1. Instalá las dependencias (solo la primera vez):
   ```
   npm install
   ```
2. Levantá el servidor de desarrollo:
   ```
   npm run dev
   ```
3. Abrí http://localhost:4321 en el navegador. Se actualiza solo
   cada vez que guardás un archivo.

## Qué falta antes de publicarlo

- **Fotos reales**: reemplazá `public/images/hero-1.jpg` y
  `public/images/nuestra-empresa.jpg` por fotos profesionales del
  cliente (mismo nombre de archivo, o cambiá la ruta en
  `src/pages/index.astro` y `src/components/AboutSection.astro`).
- **Logos de marcas**: reemplazá los archivos de `public/brands/`
  (ahora son placeholders de texto) por los logos oficiales de
  Sharp, Brother, Konica Minolta, Sindoh y Rowe, en formato SVG o
  PNG con fondo transparente, con el mismo nombre de archivo.
- **Formulario de contacto**: creá una cuenta gratis en
  https://formspree.io (u otro servicio similar) apuntando a
  ventas@tecnofotsa.com.ar, y pegá esa URL en la constante
  FORM_ENDPOINT de src/components/ContactForm.astro. Sin esto,
  el formulario se ve bien pero no manda el mail.
- **Subpáginas**: todavía faltan /nosotros, /servicios y una
  página por cada marca (7 en total). El Header ya tiene los
  links armados apuntando a esas rutas.

## Estructura del proyecto

```
src/
  layouts/Layout.astro       -> molde comun (head, Header, Footer)
  components/
    Header.astro             -> navegacion fija + menu mobile
    Hero.astro                -> portada con CTA a WhatsApp
    BrandsCarousel.astro      -> carrusel automatico de marcas
    AboutSection.astro        -> "Nuestra empresa"
    LocationMap.astro         -> mapa embebido
    ContactForm.astro         -> formulario de contacto
    Footer.astro
  pages/
    index.astro                -> arma el orden de secciones del home
  styles/global.css            -> colores, tipografia y espaciados (tokens)
```
