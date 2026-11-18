"""Inspecciona el folleto PDF de un producto del catálogo.

Uso (desde la carpeta tecnofot):
    python -P scripts/pdf-producto.py <folleto.pdf> <carpeta-de-salida>

Deja en la carpeta de salida:
  - texto.txt          el texto de las primeras páginas (para la descripción)
  - pagina-N.png       vista de cada página (para ubicar la foto del equipo)
  - img-XREF.png       cada imagen grande del PDF, con su transparencia
                       aplicada y convertida a RGB (los folletos suelen
                       traer fotos en CMYK, que salen mal sin convertir)

Y para recortar una zona de una página en alta resolución (cuando la
foto del equipo está "pegada" sobre la portada y no viene suelta):
    python -P scripts/pdf-producto.py <folleto.pdf> <salida> --recorte PAGINA X0 Y0 X1 Y1
con las coordenadas en puntos (las vistas pagina-N.png están a 1 px = 1 pt).

Requiere PyMuPDF (pip install --user pymupdf). Correr con -P y no con -I:
-I ignora los paquetes instalados con --user.
"""
import os
import sys

import pymupdf


def guardar_imagen(doc, xref, destino):
    info = doc.extract_image(xref)
    base = pymupdf.Pixmap(doc, xref)
    if base.colorspace and base.colorspace.n != 3:
        base = pymupdf.Pixmap(pymupdf.csRGB, base)  # CMYK/gris -> RGB
    smask = info.get("smask")
    if smask and not base.alpha:
        mascara = pymupdf.Pixmap(doc, smask)
        if mascara.width == base.width and mascara.height == base.height:
            base = pymupdf.Pixmap(base, mascara)
    base.save(destino)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    pdf, salida = sys.argv[1], sys.argv[2]
    os.makedirs(salida, exist_ok=True)
    doc = pymupdf.open(pdf)

    if "--recorte" in sys.argv:
        i = sys.argv.index("--recorte")
        pagina = int(sys.argv[i + 1])
        x0, y0, x1, y1 = (float(v) for v in sys.argv[i + 2 : i + 6])
        destino = os.path.join(salida, f"recorte-p{pagina}.png")
        doc[pagina - 1].get_pixmap(dpi=300, clip=pymupdf.Rect(x0, y0, x1, y1)).save(destino)
        print(destino)
        return

    with open(os.path.join(salida, "texto.txt"), "w", encoding="utf-8") as f:
        for n, page in enumerate(doc):
            if n >= 4:
                break
            f.write(f"--- página {n + 1}\n{' '.join(page.get_text().split())}\n")

    vistas = []
    for n, page in enumerate(doc):
        if n >= 4:
            break
        destino = os.path.join(salida, f"pagina-{n + 1}.png")
        page.get_pixmap(dpi=72).save(destino)
        vistas.append(destino)

    imagenes = []
    vistos = set()
    for n, page in enumerate(doc):
        if n >= 3:
            break
        for img in page.get_images(full=True):
            xref = img[0]
            if xref in vistos:
                continue
            vistos.add(xref)
            info = doc.extract_image(xref)
            if info["width"] < 250 or info["height"] < 250:
                continue
            destino = os.path.join(salida, f"img-{xref}.png")
            try:
                guardar_imagen(doc, xref, destino)
                imagenes.append(f"{destino}  {info['width']}x{info['height']}  (página {n + 1})")
            except Exception as error:  # una imagen rara no frena las demás
                imagenes.append(f"img-{xref}: no se pudo extraer ({error})")

    print(f"{os.path.basename(pdf)}: {doc.page_count} páginas")
    print("Texto: " + os.path.join(salida, "texto.txt"))
    print("Vistas: " + ", ".join(vistas))
    print("Imágenes grandes:")
    for linea in imagenes or ["  (ninguna; la foto puede estar pegada en la portada: usar --recorte)"]:
        print("  " + linea)


if __name__ == "__main__":
    main()
