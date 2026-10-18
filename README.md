# Luxury Decor Home — Sitio web

Sitio de una sola página (navegación por anclas) para **Luxury Decor Home**,
tienda premium de decoración para el hogar en Uruguay.
Sin build: HTML + CSS + JS puros, listo para publicar en cualquier hosting estático.

> *La elegancia está en los detalles.*

---

## Cómo ejecutarlo

Opción rápida (Python):

```bash
cd luxury
python3 -m http.server 8000
# abrí http://localhost:8000
```

O con Node: `npx serve .`
También funciona abriendo `index.html` directamente, aunque se recomienda servirlo por HTTP.

Para publicar: subí todo el contenido de esta carpeta a Netlify, Vercel,
GitHub Pages, Cloudflare Pages o cualquier hosting estático.

---

## Estructura

```
luxury/
├── index.html               ← estructura, textos, SEO
├── css/
│   └── styles.css           ← sistema de diseño (tokens CSS al inicio)
├── js/
│   ├── products.js          ← ★ CATÁLOGO: productos, precios, modelos
│   └── main.js              ← lógica: carrito, filtros, animaciones, video
└── assets/img/
    ├── logo.webp / logo.png ← logo con fondo transparente (desde tu archivo)
    ├── logo-original.jpg    ← tu logo original, de respaldo
    ├── og-cover.jpg         ← imagen para compartir en redes (Open Graph)
    ├── hero-poster.jpg      ← imagen del hero (poster del video)
    ├── col-*.jpg            ← fotos editoriales de cada colección
    ├── historia.jpg, detalle-dorado.jpg, led-ambiente.jpg
    └── productos/           ← (creá esta carpeta para las fotos reales)
```

---

## Guía de edición

### 1) Productos y precios — `js/products.js`
Cada producto es un bloque como este (hay instrucciones dentro del archivo):

```js
{ id: "ado-01", categoria: "adornos", nombre: "Set 2 Cisnes de Cerámica Moderna",
  medidas: "Set de 2 piezas", modelos: ["Negro", "Blanco y rojo"],
  precio: 1550, desde: false, imagen: "", imagen2: "", destacado: true, led: false }
```

- `precio: null` → se muestra **“Consultar precio”** con botón directo a WhatsApp.
- `desde: true` → muestra “desde $ X.XXX”.
- `destacado: true` → aparece en el carrusel *Piezas destacadas*.
- `led: true` → aparece en la galería oscura *La luz que habita tu pared*.

### 2) Fotos de productos
Mientras `imagen: ""` esté vacío, se ve un placeholder elegante de mármol/dorado.
Para poner la foto real: guardala en `assets/img/productos/` (ideal: WebP, vertical 4:5,
mínimo 900×1125 px) y completá la ruta, ej. `imagen: "assets/img/productos/cisnes.webp"`.
`imagen2` es la segunda foto que aparece en crossfade al pasar el mouse.

### 3) Video del hero — `js/main.js` → `CONFIG.heroVideos`
Trae cargado un clip real de Pexels (“Modern Luxury Interiors”, de Ethan Raven, 16:9)
y uno vertical opcional para celular (`heroVideoMovil`, de Max Vakhtbovych).
Para cambiarlo: conseguí la URL de archivo del video en Pexels
(`videos.pexels.com/video-files/…mp4`) y pegala en el array.
Si agregás 2 o 3, **rotan automáticamente con crossfade**.
Si el video no carga (o en celulares con conexión lenta), se ve el poster
`assets/img/hero-poster.jpg` con un zoom cinematográfico lento.

### 4) Textos marcados `[EDITAR]` (buscar en `index.html`)
- **Reseñas**: son textos de ejemplo marcados como tales — reemplazalos por reseñas reales.
- **Marquee** (cinta bajo el hero) y **Cómo comprar**: confirmar envíos, plazos y medios de pago.
- **Instagram**: las 6 imágenes son editoriales propias del diseño; reemplazalas por fotos reales del feed.
- **Open Graph**: al publicar con dominio propio, cambiá `og:image` por la URL absoluta.

### 5) Colores y tipografía — `css/styles.css` (sección 1: tokens)
Toda la paleta (crema, dorado champagne, bordó, carbón) y las fuentes
(Cormorant Garamond + DM Sans) son variables CSS: se ajustan en un solo lugar.

### 6) WhatsApp y contacto
El número del carrito está en `js/main.js` → `CONFIG.whatsapp` (`59894595028`).
Los demás enlaces de WhatsApp/Instagram/correo están en `index.html`.

---

## Cómo funciona la compra

No hay pasarela de pago: el carrito lateral junta las piezas (con modelo y cantidad)
y el botón **“Finalizar por WhatsApp”** abre `wa.me/59894595028` con el pedido
ya redactado (ítems, modelos, cantidades y total). El carrito se guarda en el
navegador del cliente (`localStorage`), así no se pierde al recargar.

---

## Notas técnicas

- Animación: GSAP + ScrollTrigger + Lenis por CDN, con fallback total si un CDN falla.
- Accesibilidad AA: foco visible, aria en menú/carrito, navegación por teclado,
  `prefers-reduced-motion` respetado, textos alternativos.
- Performance: imágenes lazy, video `preload="metadata"`, fuentes `display=swap`.
- SEO: meta + Open Graph + schema.org `Store`.
- Videos: Pexels (licencia gratuita). Imágenes editoriales generadas para esta marca.
