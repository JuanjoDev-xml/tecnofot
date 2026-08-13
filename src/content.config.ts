// Destino real: src/content.config.ts
// (OJO: directo en src/, YA NO adentro de src/content/. Borrá el
// archivo viejo en src/content/config.ts para que no quede
// duplicado / confundiendo a Astro.)
// -----------------------------------------------------------
// A partir de Astro 5 (vos estás en Astro 7), las Content
// Collections dejaron de asumir solas "esto es una carpeta de
// archivos" -> ahora hay que decirle explícitamente CÓMO leer los
// datos con un "loader". Nosotros usamos glob(), que significa:
// "andá a esta carpeta base, agarrá todos los archivos que
// matcheen este patrón, y armá una entrada de la colección por
// cada archivo". Es el reemplazo directo de lo que antes hacía
// automáticamente "type: 'data'".
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productos = defineCollection({
  loader: glob({
    // "**/*.json" = cualquier archivo .json, en cualquier
    // subcarpeta, sin importar cuántos niveles de profundidad
    // (el ** es lo que permite bajar a través de
    // src/content/productos/konica-minolta/algo.json).
    pattern: '**/*.json',
    // base = desde dónde arranca a buscar. La ruta es relativa a
    // la raíz del proyecto (donde está tu package.json).
    base: './src/content/productos',
  }),

  // El schema no cambia nada respecto a lo que ya tenías: sigue
  // validando que cada producto tenga estos campos exactos.
  schema: z.object({
    titulo: z.string(),
    imagen: z.string(),
    descripcion: z.string(),
    color: z.enum(['color', 'byn']),
    categoria: z.enum(['corporativo', 'oficina', 'hogareno']),
    folletoPdf: z.string(),
    driversUrl: z.string().url(),
  }),
});

export const collections = { productos };