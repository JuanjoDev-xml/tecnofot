// Destino real: src/content/config.ts
// -----------------------------------------------------------
// Este archivo NO genera ninguna página ni HTML. Es la "regla"
// que le decimos a Astro: "todo archivo que pongas dentro de
// src/content/productos/ tiene que tener estos campos, con estos
// tipos". Si mañana alguien crea un producto y le pone el color
// mal escrito (ej: "Color" con mayúscula en vez de "color"), Astro
// va a fallar el build y te va a decir EXACTAMENTE qué archivo y
// qué campo está mal -> mucho mejor que descubrirlo mirando la
// página ya publicada y viendo que algo no filtra bien.
import { defineCollection, z } from 'astro:content';

const productos = defineCollection({
  // type: 'data' = "esto es información estructurada (JSON/YAML),
  // no un texto largo con formato". La otra opción, type: 'content',
  // es para cuando el archivo tiene un cuerpo de texto en Markdown
  // (como un post de blog). Acá no necesitamos eso: título,
  // descripción corta, tags y links son todo "datos", no prosa.
  type: 'data',

  // z.object({...}) es la validación en sí (viene de la librería
  // "zod", que Astro ya trae incorporada). Cada línea define un
  // campo: su nombre, su tipo, y en el caso de "color" y
  // "categoria", qué valores exactos están permitidos.
  schema: z.object({
    titulo: z.string(),
    imagen: z.string(), // ruta a la foto, ej: "/images/productos/konica-minolta/bizhub-c227.jpg"
    descripcion: z.string(),

    // z.enum([...]) = "tiene que ser EXACTAMENTE uno de estos
    // valores, ni uno más". Así evitamos que un producto quede sin
    // filtrar por typos como "colorr" o "Color".
    color: z.enum(['color', 'byn']), // byn = blanco y negro

    // Van 3 categorías hoy. El día que agreguen una 4ta (dijiste
    // que puede pasar), se suma acá una palabra más a la lista y
    // ya está disponible en todo el sitio.
    categoria: z.enum(['corporativo', 'oficina', 'hogareno']),

    folletoPdf: z.string(), // ruta al PDF, ej: "/pdfs/konica-minolta/bizhub-c227.pdf"
    driversUrl: z.string().url(), // .url() valida que sea un link real (con http/https)
  }),
});

// Astro busca específicamente un "export const collections" acá
// -> es el mapa entre el nombre de carpeta (src/content/productos)
// y el esquema que definimos arriba. Si en el futuro agregan otro
// tipo de contenido (ej. "noticias"), se suma otra entrada acá.
export const collections = { productos };