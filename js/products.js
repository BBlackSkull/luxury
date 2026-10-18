/* ==========================================================================
   LUXURY DECOR HOME — Catálogo de productos
   --------------------------------------------------------------------------
   CÓMO EDITAR:
   · Cada producto es un bloque { ... }. Copiá uno para agregar piezas nuevas.
   · precio: número en pesos uruguayos (ej: 1599 → se muestra "$ 1.599").
             Si todavía no tiene precio, dejá  precio: null  y en el sitio
             aparecerá "Consultar precio" con botón directo a WhatsApp.
   · desde: true  → muestra "desde $ X.XXX".
   · modelos: lista de variantes (color/modelo). Si no tiene, dejá [].
   · imagen / imagen2: ruta de la foto (ej: "assets/img/productos/cisnes.webp").
             Mientras estén en "" se muestra un placeholder elegante de mármol.
             imagen2 es la foto secundaria que aparece al pasar el mouse.
   · destacado: true → aparece en el carrusel "Piezas destacadas".
   · led: true → aparece en la galería oscura "Luz que habita" (cuadros LED).
   ========================================================================== */

window.LDH_CATEGORIES = [
  { id: "cuadros",  nombre: "Cuadros",          tono: "tono-cuadros"  },
  { id: "adornos",  nombre: "Adornos",          tono: "tono-adornos"  },
  { id: "alfombras",nombre: "Alfombras",        tono: "tono-alfombras"},
  { id: "relojes",  nombre: "Relojes de pared", tono: "tono-relojes"  }
];

window.LDH_PRODUCTS = [

  /* ------------------------------- ALFOMBRAS ------------------------------ */
  { id: "alf-01", categoria: "alfombras", nombre: "Alfombra Peluda Shaggy",
    medidas: "160 × 200 cm", modelos: ["Rojo", "Gris", "Negro", "Arcoíris", "Azul"],
    precio: 1599, desde: false, imagen: "", imagen2: "", destacado: true, led: false },

  { id: "alf-02", categoria: "alfombras", nombre: "Alfombra Dólar Euro Lavable",
    medidas: "50 × 120 cm", modelos: ["Negro y dorado", "Gris", "Verde", "Negro"],
    precio: 1990, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "alf-03", categoria: "alfombras", nombre: "Alfombra Parking Mat Pro",
    medidas: "Uso en estacionamiento", modelos: ["Varios colores"],
    precio: 1790, desde: true, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "alf-04", categoria: "alfombras", nombre: "Alfombra Peluda Corazón",
    medidas: "40 × 50 cm", modelos: ["Blanco", "Rojo", "Negro", "Rosado"],
    precio: 790, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "alf-05", categoria: "alfombras", nombre: "Alfombra Peluda Redonda",
    medidas: "Ø 60 cm", modelos: ["Beige", "Blanco", "Gris", "Negro", "Rojo", "Rosado"],
    precio: 1290, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "alf-06", categoria: "alfombras", nombre: "Alfombra Entradas Hogar",
    medidas: "40 × 60 cm · Estilo americano", modelos: [],
    precio: 890, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "alf-07", categoria: "alfombras", nombre: "Set 2 Alfombras de Cocina Antideslizante",
    medidas: "Set de 2 piezas", modelos: [],
    precio: 1560, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "alf-08", categoria: "alfombras", nombre: "Alfombra Sala de Estar Diseño Moderno",
    medidas: "150 × 220 cm", modelos: ["Negro y beige", "Beige y negro"],
    precio: 2990, desde: false, imagen: "", imagen2: "", destacado: true, led: false },

  { id: "alf-09", categoria: "alfombras", nombre: "Set 3 Alfombras de Baño Antideslizante Absorbente",
    medidas: "Set de 3 piezas", modelos: [],
    precio: 1650, desde: true, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "alf-10", categoria: "alfombras", nombre: "Alfombra de Baño Peluda",
    medidas: "50 × 80 cm", modelos: [],
    precio: 990, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  /* ------------------------------- ADORNOS -------------------------------- */
  { id: "ado-01", categoria: "adornos", nombre: "Set 2 Cisnes de Cerámica Moderna",
    medidas: "Set de 2 piezas", modelos: ["Negro", "Blanco y rojo", "Rojo y blanco"],
    precio: 1550, desde: false, imagen: "", imagen2: "", destacado: true, led: false },

  { id: "ado-02", categoria: "adornos", nombre: "Adorno Pareja Corazón en Cerámica",
    medidas: "Cerámica", modelos: [],
    precio: 790, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "ado-03", categoria: "adornos", nombre: "Escultura León al Acecho",
    medidas: "resina", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: true, led: false },

  { id: "ado-04", categoria: "adornos", nombre: "Escultura Leopardo",
    medidas: "resina", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "ado-05", categoria: "adornos", nombre: "Adorno Águila Minimalista",
    medidas: "resina", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "ado-06", categoria: "adornos", nombre: "Adorno Bulldog Arte Pop",
    medidas: "resina", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "ado-07", categoria: "adornos", nombre: "Adorno Toro Graffiti Dólares",
    medidas: "resina", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "ado-08", categoria: "adornos", nombre: "Adorno Rostro Beso",
    medidas: "resina", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "ado-09", categoria: "adornos", nombre: "Set 2 Esculturas de Cerámica Nórdica",
    medidas: "Set de 2 piezas · Cerámica", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "ado-10", categoria: "adornos", nombre: "Soporte para Botella de Vino Caballo",
    medidas: "resina", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  /* ------------------------------- CUADROS -------------------------------- */
  { id: "cua-01", categoria: "cuadros", nombre: "Cuadro Astronauta 3D con Luz LED",
    medidas: "50 × 100 cm · Luz LED", modelos: [],
    precio: 4490, desde: false, imagen: "", imagen2: "", destacado: true, led: true },

  { id: "cua-02", categoria: "cuadros", nombre: "Cuadro Labios Dólares en resina",
    medidas: "70 × 50 cm · resina", modelos: [],
    precio: 2790, desde: false, imagen: "", imagen2: "", destacado: true, led: false },

  { id: "cua-03", categoria: "cuadros", nombre: "Cuadro Mujer de Lujo LED",
    medidas: "50 × 70 cm · resina · Luz LED", modelos: [],
    precio: 3290, desde: false, imagen: "", imagen2: "", destacado: true, led: true },

  { id: "cua-04", categoria: "cuadros", nombre: "Cuadro Caballo Crystal Art",
    medidas: "Crystal Art", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  { id: "cua-05", categoria: "cuadros", nombre: "Cuadro Pavo Real LED y Diamantes",
    medidas: "Luz LED · Diamantes", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: true },

  { id: "cua-06", categoria: "cuadros", nombre: "Cuadro Mural Vista al Mar LED",
    medidas: "Mural · Luz LED", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: true },

  { id: "cua-07", categoria: "cuadros", nombre: "Cuadro Auto de Carreras LED",
    medidas: "Luz LED", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: true },

  { id: "cua-08", categoria: "cuadros", nombre: "Set Cuadros Tríptico LED",
    medidas: "Tríptico · Luz LED", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: true },

  { id: "cua-09", categoria: "cuadros", nombre: "Cuadro Tapa Tablero Eléctrico en resina",
    medidas: "resina", modelos: [],
    precio: null, desde: false, imagen: "", imagen2: "", destacado: false, led: false },

  /* --------------------------- RELOJES DE PARED --------------------------- */
  { id: "rel-01", categoria: "relojes", nombre: "Reloj de Lujo Arte Abstracto",
    medidas: "60 × 60 cm", modelos: [],
    precio: 1790, desde: true, imagen: "", imagen2: "", destacado: true, led: false },

  { id: "rel-02", categoria: "relojes", nombre: "Reloj Calendario Crystal Art",
    medidas: "40 × 80 cm · Crystal Art", modelos: [],
    precio: 2790, desde: false, imagen: "", imagen2: "", destacado: true, led: false },

  { id: "rel-03", categoria: "relojes", nombre: "Set Reloj Tríptico Arte Abstracto",
    medidas: "Tríptico", modelos: ["Dorado"],
    precio: 4490, desde: false, imagen: "", imagen2: "", destacado: true, led: false }
];
