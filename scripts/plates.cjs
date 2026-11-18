// Separa una foto en 4 planchas CMYK (tinta + alfa) para apilarlas en 3D.
const sharp = require('sharp');
// Uso: node scripts/plates.cjs [foto] [carpeta de salida]
const src = process.argv[2] || 'public/images/hero-local-desktop.webp';
const outDir = process.argv[3] || 'public/images/hero-plates';
const W = 900, H = 600, GCR = 0.75;
const INK = { c: [0, 174, 239], m: [236, 0, 140], y: [255, 237, 0], k: [17, 19, 28] };
(async () => {
  const { data } = await sharp(src).resize(W, H, { fit: 'cover', position: 'attention' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = { c: Buffer.alloc(W * H * 4), m: Buffer.alloc(W * H * 4), y: Buffer.alloc(W * H * 4), k: Buffer.alloc(W * H * 4) };
  for (let i = 0, p = 0; i < W * H; i++, p += 3) {
    const r = data[p] / 255, g = data[p + 1] / 255, b = data[p + 2] / 255;
    const k = GCR * (1 - Math.max(r, g, b));
    const d = 1 - k || 1;
    const a = { c: (1 - r - k) / d, m: (1 - g - k) / d, y: (1 - b - k) / d, k };
    for (const ch of 'cmyk') {
      const o = i * 4, ink = INK[ch];
      out[ch][o] = ink[0]; out[ch][o + 1] = ink[1]; out[ch][o + 2] = ink[2];
      out[ch][o + 3] = Math.round(Math.max(0, Math.min(1, a[ch])) * 255);
    }
  }
  for (const ch of 'cmyk') {
    const f = `${outDir}/plate-${ch}.webp`;
    await sharp(out[ch], { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 50, alphaQuality: 55, effort: 6 }).toFile(f);
    console.log(f, require('fs').statSync(f).size + 'B');
  }
  const full = `${outDir}/full.webp`;
  await sharp(src).resize(W, H, { fit: 'cover', position: 'attention' }).webp({ quality: 80 }).toFile(full);
  console.log(full, require('fs').statSync(full).size + 'B');
})();
