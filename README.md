# Tecnofot

Sitio web de **Tecnofot SA**, empresa de soluciones de impresión y digitalización de documentos en Bahía Blanca desde 1985: venta, alquiler, service e insumos de equipos de las principales marcas.

🌐 [tecnofot.com.ar](https://tecnofot.com.ar)

## Stack

- [Astro 7](https://astro.build): sitio estático, sin frameworks de UI.
- [Content Collections](https://docs.astro.build/en/guides/content-collections/) para el catálogo de productos (JSON validado con Zod).
- CSS propio con tokens de diseño en `src/styles/global.css`, con modo claro y oscuro.
- Tipografía [Manrope](https://fontsource.org/fonts/manrope) vía Fontsource.

## Requisitos

- Node.js **22.12** o superior
- [pnpm](https://pnpm.io)

## Puesta en marcha

```bash
pnpm install
pnpm dev
```

El sitio queda disponible en `http://localhost:4321` y se recarga solo al guardar.

| Comando        | Acción                                         |
| -------------- | ---------------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo                          |
| `pnpm build`   | Genera el sitio de producción en `dist/`        |
| `pnpm preview` | Sirve localmente el build de `dist/`            |

## Estructura

```
src/
├── components/          Secciones y piezas reutilizables (Header, Hero, Footer,
│                        ProductCard, ContactForm, FloatingButtons…)
├── content/productos/   Catálogo: un JSON por producto, una carpeta por marca
├── content.config.ts    Schema del catálogo
├── layouts/Layout.astro Estructura común de las páginas (head, header, footer)
├── pages/
│   ├── index.astro      Inicio
│   ├── nosotros.astro
│   ├── servicios.astro
│   ├── insumos.astro
│   └── marcas/[marca].astro   Catálogo por marca (una página por carpeta)
└── styles/global.css    Tokens de color, tipografía y espaciado

public/
├── images/              Fotos del sitio (hero, nosotros…)
├── images/productos/    Fotos de productos, por marca
├── pdfs/                Folletos de productos, por marca
└── brands/              Logos del carrusel de marcas
```

## Catálogo de productos

Cada producto es un archivo JSON dentro de `src/content/productos/<marca>/`. La página `/marcas/<marca>` se genera automáticamente para cada carpeta que tenga al menos un producto, con buscador y filtros por color y categoría.

### Campos

| Campo         | Tipo                                     | Requerido | Descripción                                   |
| ------------- | ---------------------------------------- | --------- | --------------------------------------------- |
| `titulo`      | texto                                    | Sí        | Nombre del modelo                             |
| `imagen`      | ruta                                     | Sí        | Foto en `public/images/productos/<marca>/`    |
| `descripcion` | texto                                    | Sí        | 2 o 3 oraciones con lo principal              |
| `color`       | `color` \| `byn`                         | Sí        | Impresión color o blanco y negro              |
| `categoria`   | `corporativo` \| `oficina` \| `hogareno` | Sí        | Segmento del equipo                           |
| `folletoPdf`  | ruta                                     | No        | Folleto en `public/pdfs/<marca>/`. Sin este campo la tarjeta no muestra el botón «Folleto» |
| `driversUrl`  | URL                                      | Sí        | Página de descarga de drivers del fabricante  |

### Agregar un producto

1. **Foto**: `public/images/productos/<marca>/<slug>.webp`
2. **Folleto** (opcional): `public/pdfs/<marca>/<slug>.pdf`
3. **Datos**: `src/content/productos/<marca>/<slug>.json`

```json
{
    "titulo": "MX532adwe",
    "imagen": "/images/productos/lexmark/mx532adwe.webp",
    "descripcion": "Multifunción láser monocromática de 44/46 ppm…",
    "color": "byn",
    "categoria": "oficina",
    "folletoPdf": "/pdfs/lexmark/mx532adwe.pdf",
    "driversUrl": "https://www.lexmark.com"
}
```

Si un campo no cumple el schema, `pnpm dev` y `pnpm build` muestran el error indicando el archivo.

### Convenciones

- **Slugs** en minúscula y con guiones, sin espacios ni tildes: `ineo-plus-268i`, `designjet-t908`. Los mismos para la foto, el PDF y el JSON.
- **Fotos**: imagen normal del producto (no esquemas de configuración), fondo blanco, formato 4:3, unos 1000 px de ancho, en `.webp`.
- **Marcas nuevas**: crear la carpeta en `src/content/productos/` y agregar la marca al menú en `src/components/Header.astro` y, si corresponde, su logo al carrusel en `src/pages/index.astro`. Las siglas que no deben mostrarse capitalizadas (p. ej. «HP») se declaran en `nombresEspeciales` dentro de `src/pages/marcas/[marca].astro`.

## Configuración

- **Formulario de contacto**: envía a través de [Formspree](https://formspree.io). La URL del formulario se define en la constante `FORM_ENDPOINT` de `src/components/ContactForm.astro`.
- **WhatsApp y teléfono**: el número aparece en `Hero.astro`, `FloatingButtons.astro`, `ContactForm.astro` y `Footer.astro`. Si cambia, hay que actualizarlo en los cuatro.

## Ramas

- `develop`: rama de trabajo.
- `main`: versión publicada. Los cambios llegan desde `develop` por merge.

---

Desarrollado por [Juan José Denk Guido](https://github.com/JuanjoDev-xml).
