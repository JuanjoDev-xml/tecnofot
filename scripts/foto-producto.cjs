// Prepara la foto de un producto del catálogo con el formato de
// todas las cards: fondo blanco, 4:3, 1000 x 750 px, webp.
//
// Uso (desde la carpeta tecnofot):
//   node scripts/foto-producto.cjs <foto> <marca>/<slug> [--fondo]
//
//   <foto>    png/jpg/webp de entrada (puede tener transparencia)
//   <marca>/<slug>  ej: brother/hl-l1222 -> public/images/productos/brother/hl-l1222.webp
//   --fondo   la foto viene con fondo propio (recorte de portada):
//             no se recorta el borde, se centra entera sobre blanco.
//
// Sin --fondo, recorta el blanco sobrante alrededor del equipo y
// lo centra con margen, que es lo correcto para fotos de producto.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const [src, dest] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const conFondo = process.argv.includes('--fondo');

if (!src || !dest || !dest.includes('/')) {
  console.error('Uso: node scripts/foto-producto.cjs <foto> <marca>/<slug> [--fondo]');
  process.exit(1);
}

const out = path.join('public', 'images', 'productos', `${dest}.webp`);
const CW = 1200, CH = 900;

(async () => {
  let img = sharp(src).flatten({ background: '#ffffff' });
  if (!conFondo) img = img.trim({ threshold: 15 });
  const recorte = await img.png().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = recorte.info;

  // Producto: hasta 780 px de alto y con 80 px de margen a los costados.
  // Recorte de portada: casi todo el lienzo.
  const maxH = conFondo ? 840 : 780;
  const maxW = CW - (conFondo ? 60 : 160);
  const escala = Math.min(maxH / h, maxW / w);
  const pieza = await sharp(recorte.data).resize({ width: Math.round(w * escala) }).png().toBuffer({ resolveWithObject: true });

  const lienzo = await sharp({ create: { width: CW, height: CH, channels: 3, background: '#ffffff' } })
    .composite([{ input: pieza.data, left: Math.round((CW - pieza.info.width) / 2), top: Math.round((CH - pieza.info.height) / 2) }])
    .png()
    .toBuffer();

  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(lienzo).resize({ width: 1000 }).webp({ quality: 82 }).toFile(out);

  console.log(`${out}  (${fs.statSync(out).size} B)  original recortado: ${w}x${h}`);
  if (Math.max(w, h) < 400) console.log('AVISO: la foto original es chica (<400 px); en la card se va a ver un poco borrosa.');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
