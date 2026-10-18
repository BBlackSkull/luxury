/* ==========================================================================
   LUXURY DECOR HOME — Lógica del sitio
   Vanilla JS (sin build). GSAP + ScrollTrigger + Lenis vía CDN, con
   degradación elegante: si un CDN falla, el sitio sigue 100% funcional.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     CONFIGURACIÓN EDITABLE
  ------------------------------------------------------------------------ */
  const CONFIG = {
    whatsapp: "59894595028",

    /* ▶ VIDEOS DEL HERO (Pexels)
       Dejá uno solo o agregá varios: rotan con crossfade.
       Para usar otro clip de Pexels, pegá acá su URL de archivo
       (videos.pexels.com/video-files/.....mp4). */
    heroVideos: [
      "https://videos.pexels.com/video-files/31617692/13470975_1920_1080_24fps.mp4" // "Modern Luxury Interiors" — Ethan Raven (16:9)
    ],
    /* Clip vertical opcional para celular (se carga solo con buena conexión).
       Dejalo en "" para usar siempre el poster animado en móvil. */
    heroVideoMovil: "https://videos.pexels.com/video-files/7239168/7239168-uhd_1440_2560_25fps.mp4" // Max Vakhtbovych (9:16)
  };

  /* ------------------------------------------------------------------------
     UTILIDADES
  ------------------------------------------------------------------------ */
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const punteroFino   = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const formatoPrecio = n => "$ " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const sinAcentos = s => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const linkWA = texto => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

  /* ------------------------------------------------------------------------
     DATOS
  ------------------------------------------------------------------------ */
  const PRODUCTOS  = window.LDH_PRODUCTS   || [];
  const CATEGORIAS = window.LDH_CATEGORIES || [];
  const catPorId   = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const prodPorId  = Object.fromEntries(PRODUCTOS.map(p => [p.id, p]));

  /* ------------------------------------------------------------------------
     PLANTILLAS DE PRODUCTO
  ------------------------------------------------------------------------ */
  function placeholderHTML(p) {
    const cat = catPorId[p.categoria] || { nombre: p.categoria, tono: "" };
    return `
      <div class="ph ${cat.tono}" data-letra="${esc(cat.nombre.charAt(0))}" role="img"
           aria-label="Imagen de ${esc(p.nombre)} próximamente">
        <span class="ph-orn" aria-hidden="true"></span>
        <span class="ph-cat">${esc(cat.nombre)}</span>
        <span class="ph-nota">Luxury Decor Home</span>
        <span class="brillo" aria-hidden="true"></span>
      </div>`;
  }

  function mediaHTML(p) {
    if (!p.imagen) return placeholderHTML(p);
    const img2 = p.imagen2
      ? `<img class="img-2" src="${esc(p.imagen2)}" alt="" loading="lazy" aria-hidden="true">` : "";
    return `<img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy">${img2}`;
  }

  function modeloHTML(p) {
    if (!p.modelos || !p.modelos.length) return "";
    const opciones = p.modelos.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join("");
    return `
      <div class="card-modelo">
        <label aria-hidden="true">Modelo / Color</label>
        <div class="select-wrap">
          <select data-modelo aria-label="Elegí modelo o color de ${esc(p.nombre)}">${opciones}</select>
        </div>
      </div>`;
  }

  function precioHTML(p) {
    if (p.precio == null) return `<p class="precio precio--consultar">Consultar precio</p>`;
    return `<p class="precio">${p.desde ? "<small>desde</small>" : ""}${formatoPrecio(p.precio)}</p>`;
  }

  function accionesHTML(p, oscuro) {
    if (p.precio == null) {
      return `<button class="btn btn--sm ${oscuro ? "btn--outline-l" : "btn--outline-d"}"
                      data-consultar="${p.id}">Consultar</button>`;
    }
    return `<button class="btn btn--sm ${oscuro ? "btn--dor" : ""}" data-add="${p.id}"
                    aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar</button>`;
  }

  /* Tarjeta estándar (destacados + catálogo) */
  function cardHTML(p, i) {
    const cat = catPorId[p.categoria] || { nombre: p.categoria };
    const badge = p.led
      ? `<span class="card-badge card-badge--led">Luz LED</span>`
      : (p.destacado ? `<span class="card-badge">Destacado</span>` : "");
    const rapido = p.precio == null
      ? `<button class="btn btn--sm btn--dor card-rapido" data-consultar="${p.id}">Consultar esta pieza</button>`
      : `<button class="btn btn--sm card-rapido" data-add="${p.id}">Agregar al carrito</button>`;
    return `
    <article class="card" style="animation: entra-item .7s var(--ease) ${Math.min(i * 45, 400)}ms both">
      <div class="card-media">
        ${mediaHTML(p)}
        ${badge}
        ${rapido}
      </div>
      <div class="card-body">
        <p class="card-cat">${esc(cat.nombre)}</p>
        <h3 class="card-nombre">${esc(p.nombre)}</h3>
        <p class="card-medidas">${esc(p.medidas || "")}</p>
        ${modeloHTML(p)}
        <div class="card-pie">
          ${precioHTML(p)}
          <div class="card-acciones">${accionesHTML(p, false)}</div>
        </div>
      </div>
    </article>`;
  }

  /* Tarjeta de la galería LED (se “enciende” al entrar en pantalla) */
  function ledCardHTML(p) {
    const media = p.imagen
      ? `<img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy">`
      : placeholderHTML(p);
    return `
    <article class="led-card">
      <div class="led-media">
        ${media}
        <span class="led-glow" aria-hidden="true"></span>
        <span class="card-badge card-badge--led">Luz LED</span>
      </div>
      <div class="led-body">
        <h3 class="card-nombre">${esc(p.nombre)}</h3>
        <p class="card-medidas">${esc(p.medidas || "")}</p>
        ${modeloHTML(p)}
        <div class="card-pie">
          ${precioHTML(p)}
          <div class="card-acciones">${accionesHTML(p, true)}</div>
        </div>
      </div>
    </article>`;
  }

  /* ------------------------------------------------------------------------
     RENDER: DESTACADOS, LED, CONTEOS
  ------------------------------------------------------------------------ */
  function renderDestacados() {
    const rail = $("#railDestacados");
    if (!rail) return;
    rail.innerHTML = PRODUCTOS.filter(p => p.destacado).map(cardHTML).join("");
  }

  function renderLED() {
    const lista = $("#ledLista");
    if (!lista) return;
    lista.innerHTML = PRODUCTOS.filter(p => p.led).map(ledCardHTML).join("");
    encenderAlVer(lista);
  }

  /* Las piezas LED se encienden en cascada al entrar en el viewport */
  function encenderAlVer(contenedor) {
    const cards = $$(".led-card", contenedor);
    if (reducedMotion || !("IntersectionObserver" in window)) {
      cards.forEach(c => c.classList.add("encendida"));
      return;
    }
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (e.isIntersecting) {
          const i = cards.indexOf(e.target);
          setTimeout(() => e.target.classList.add("encendida"), (i % 2) * 220);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    cards.forEach(c => io.observe(c));
  }

  function renderConteos() {
    $$("[data-count-cat]").forEach(el => {
      const n = PRODUCTOS.filter(p => p.categoria === el.dataset.countCat).length;
      el.textContent = n;
    });
  }

  /* ------------------------------------------------------------------------
     CATÁLOGO: FILTROS + BÚSQUEDA + ORDEN (con skeleton)
  ------------------------------------------------------------------------ */
  const estado = { cat: "todas", q: "", orden: "relevancia" };
  let timerSkeleton = null;

  function renderChips() {
    const wrap = $("#chips");
    if (!wrap) return;
    const total = PRODUCTOS.length;
    let html = `<button class="chip ${estado.cat === "todas" ? "activo" : ""}" data-cat="todas"
                  aria-pressed="${estado.cat === "todas"}">Todas<span class="chip-n">${total}</span></button>`;
    html += CATEGORIAS.map(c => {
      const n = PRODUCTOS.filter(p => p.categoria === c.id).length;
      return `<button class="chip ${estado.cat === c.id ? "activo" : ""}" data-cat="${c.id}"
                aria-pressed="${estado.cat === c.id}">${esc(c.nombre)}<span class="chip-n">${n}</span></button>`;
    }).join("");
    wrap.innerHTML = html;
  }

  function filtrarProductos() {
    let lista = PRODUCTOS.slice();
    if (estado.cat !== "todas") lista = lista.filter(p => p.categoria === estado.cat);
    if (estado.q) {
      const q = sinAcentos(estado.q);
      lista = lista.filter(p =>
        sinAcentos(p.nombre).includes(q) ||
        sinAcentos((catPorId[p.categoria] || {}).nombre).includes(q) ||
        (p.modelos || []).some(m => sinAcentos(m).includes(q)) ||
        sinAcentos(p.medidas).includes(q));
    }
    const sinPrecioAlFinal = (a, b) =>
      (a.precio == null ? Infinity : a.precio) - (b.precio == null ? Infinity : b.precio);
    if (estado.orden === "precio-asc")  lista.sort(sinPrecioAlFinal);
    if (estado.orden === "precio-desc")
      lista.sort((a, b) => (b.precio == null ? -Infinity : b.precio) - (a.precio == null ? -Infinity : a.precio));
    if (estado.orden === "nombre")      lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    if (estado.orden === "relevancia")  lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    return lista;
  }

  function renderCatalogo(conSkeleton) {
    const grid = $("#gridCatalogo");
    if (!grid) return;
    clearTimeout(timerSkeleton);

    const pintar = () => {
      const lista = filtrarProductos();
      grid.innerHTML = lista.map(cardHTML).join("");
      $("#sinResultados").hidden = lista.length > 0;
      const resumen = $("#resumenResultados");
      if (resumen) resumen.textContent =
        lista.length ? `Se muestran ${lista.length} piezas.` : "Sin resultados para tu búsqueda.";
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };

    if (conSkeleton && !reducedMotion) {
      grid.innerHTML = Array.from({ length: 8 }, () =>
        `<div class="skel-card" aria-hidden="true"><div class="skel"></div><div class="skel-txt"></div><div class="skel-txt corto"></div></div>`
      ).join("");
      timerSkeleton = setTimeout(pintar, 380);
    } else {
      pintar();
    }
  }

  function aplicarFiltro(cat) {
    estado.cat = cat;
    renderChips();
    renderCatalogo(true);
  }

  function iniciarCatalogo() {
    renderChips();
    renderCatalogo(false);

    $("#chips").addEventListener("click", e => {
      const chip = e.target.closest("[data-cat]");
      if (chip) aplicarFiltro(chip.dataset.cat);
    });

    let timerBuscar;
    $("#buscar").addEventListener("input", e => {
      clearTimeout(timerBuscar);
      timerBuscar = setTimeout(() => { estado.q = e.target.value.trim(); renderCatalogo(true); }, 220);
    });

    $("#orden").addEventListener("change", e => {
      estado.orden = e.target.value;
      renderCatalogo(true);
    });
  }

  /* ------------------------------------------------------------------------
     CARRUSEL DE DESTACADOS (drag + snap + botones + progreso)
  ------------------------------------------------------------------------ */
  function iniciarCarrusel() {
    const rail = $("#railDestacados");
    if (!rail) return;
    const barra = $("#railProgreso");
    const btnPrev = $("#railPrev"), btnNext = $("#railNext");

    const paso = () => {
      const card = rail.querySelector(".card");
      return card ? card.offsetWidth + 26 : 360;
    };
    const actualizar = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const prog = max > 0 ? rail.scrollLeft / max : 0;
      if (barra) barra.style.width = (12 + prog * 88) + "%";
      if (btnPrev) btnPrev.disabled = rail.scrollLeft <= 4;
      if (btnNext) btnNext.disabled = rail.scrollLeft >= max - 4;
    };
    rail.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    if (btnPrev) btnPrev.addEventListener("click", () => rail.scrollBy({ left: -paso(), behavior: "smooth" }));
    if (btnNext) btnNext.addEventListener("click", () => rail.scrollBy({ left:  paso(), behavior: "smooth" }));

    /* Drag con mouse (en táctil manda el scroll nativo) */
    let arrastrando = false, inicioX = 0, inicioScroll = 0, seMovio = false;
    rail.addEventListener("pointerdown", e => {
      if (e.pointerType !== "mouse") return;
      arrastrando = true; seMovio = false;
      inicioX = e.clientX; inicioScroll = rail.scrollLeft;
      rail.classList.add("arrastrando");
    });
    rail.addEventListener("pointermove", e => {
      if (!arrastrando) return;
      const dx = e.clientX - inicioX;
      if (Math.abs(dx) > 6) seMovio = true;
      rail.scrollLeft = inicioScroll - dx;
    });
    const soltar = () => { arrastrando = false; rail.classList.remove("arrastrando"); };
    rail.addEventListener("pointerup", soltar);
    rail.addEventListener("pointercancel", soltar);
    rail.addEventListener("click", e => { if (seMovio) { e.preventDefault(); e.stopPropagation(); seMovio = false; } }, true);

    actualizar();
  }

  /* ------------------------------------------------------------------------
     CARRITO → WHATSAPP
  ------------------------------------------------------------------------ */
  const CLAVE_CARRITO = "ldh_carrito_v1";
  let carrito = cargarCarrito(); // [{ id, modelo, cant }]

  function cargarCarrito() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");
      return Array.isArray(datos) ? datos.filter(i => prodPorId[i.id]) : [];
    } catch (e) { return []; }
  }
  function guardarCarrito() {
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); } catch (e) {}
  }

  const cantTotal = () => carrito.reduce((s, i) => s + i.cant, 0);
  const subtotal  = () => carrito.reduce((s, i) => s + (prodPorId[i.id].precio || 0) * i.cant, 0);

  function modeloDeLaCard(boton) {
    const card = boton.closest(".card, .led-card");
    const sel = card ? card.querySelector("[data-modelo]") : null;
    return sel ? sel.value : "";
  }

  function agregarAlCarrito(id, modelo) {
    const existente = carrito.find(i => i.id === id && i.modelo === modelo);
    if (existente) existente.cant += 1;
    else carrito.push({ id, modelo, cant: 1 });
    guardarCarrito();
    actualizarBadge(true);
    renderDrawer();
    mostrarToast(`“${prodPorId[id].nombre}” se sumó a tu selección`);
  }

  function consultarProducto(id, modelo) {
    const p = prodPorId[id];
    const texto =
      `Hola Luxury Decor Home, me interesa esta pieza:\n\n` +
      `• ${p.nombre}${p.medidas ? ` (${p.medidas})` : ""}` +
      `${modelo ? `\n• Modelo: ${modelo}` : ""}` +
      `${p.precio != null ? `\n• Precio publicado: ${formatoPrecio(p.precio)}` : ""}` +
      `\n\n¿Me confirman disponibilidad? ¡Gracias!`;
    window.open(linkWA(texto), "_blank", "noopener");
  }

  function actualizarBadge(conPop) {
    const badge = $("#carritoCount");
    const n = cantTotal();
    badge.textContent = n;
    badge.classList.toggle("visible", n > 0);
    if (conPop && n > 0) {
      badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop");
    }
  }

  function renderDrawer() {
    const wrap = $("#drawerItems");
    const pie  = $("#drawerPie");
    $("#drawerCant").textContent = carrito.length ? `· ${cantTotal()} ${cantTotal() === 1 ? "pieza" : "piezas"}` : "";

    if (!carrito.length) {
      wrap.innerHTML = `
        <div class="drawer-vacio">
          <div class="ornamento" aria-hidden="true" style="margin-bottom:22px;"><i></i></div>
          <p class="t-display">Tu selección está vacía</p>
          <p>Recorré la colección y sumá las piezas que hagan único tu hogar.</p>
          <button class="btn btn--outline-d" data-cerrar-carrito>Explorar la colección</button>
        </div>`;
      pie.hidden = true;
      return;
    }
    pie.hidden = false;

    wrap.innerHTML = carrito.map(item => {
      const p = prodPorId[item.id];
      const clave = `${item.id}::${item.modelo}`;
      const thumb = p.imagen
        ? `<img src="${esc(p.imagen)}" alt="">`
        : placeholderHTML(p);
      return `
      <div class="item">
        <div class="item-thumb">${thumb}</div>
        <div class="item-info">
          <h3>${esc(p.nombre)}</h3>
          ${item.modelo ? `<p class="item-modelo">Modelo: ${esc(item.modelo)}</p>` : ""}
          <p class="item-precio">${formatoPrecio((p.precio || 0) * item.cant)}</p>
          <div class="cantidad" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
            <button data-dec="${esc(clave)}" aria-label="Quitar uno">−</button>
            <output aria-live="polite">${item.cant}</output>
            <button data-inc="${esc(clave)}" aria-label="Agregar uno">+</button>
          </div>
        </div>
        <button class="item-quitar" data-del="${esc(clave)}" aria-label="Quitar ${esc(p.nombre)} del carrito">✕</button>
      </div>`;
    }).join("");

    $("#drawerSubtotal").textContent = formatoPrecio(subtotal());
  }

  function finalizarPorWhatsApp() {
    if (!carrito.length) return;
    const lineas = carrito.map(item => {
      const p = prodPorId[item.id];
      return `• ${p.nombre}${item.modelo ? ` — Modelo: ${item.modelo}` : ""} × ${item.cant} — ${formatoPrecio((p.precio || 0) * item.cant)}`;
    });
    const texto =
      `Hola Luxury Decor Home, quiero confirmar este pedido:\n\n` +
      lineas.join("\n") +
      `\n\nTotal: ${formatoPrecio(subtotal())}\n\n¡Gracias! Quedo atento/a a la confirmación.`;
    window.open(linkWA(texto), "_blank", "noopener");
  }

  /* Toast */
  let timerToast;
  function mostrarToast(mensaje) {
    const toast = $("#toast");
    $("#toastTexto").textContent = mensaje;
    toast.classList.add("visible");
    clearTimeout(timerToast);
    timerToast = setTimeout(() => toast.classList.remove("visible"), 3200);
  }

  /* Delegación global de clicks (agregar / consultar / cantidades) */
  document.addEventListener("click", e => {
    const btnAdd = e.target.closest("[data-add]");
    if (btnAdd) { agregarAlCarrito(btnAdd.dataset.add, modeloDeLaCard(btnAdd)); return; }

    const btnCon = e.target.closest("[data-consultar]");
    if (btnCon) { consultarProducto(btnCon.dataset.consultar, modeloDeLaCard(btnCon)); return; }

    const buscarItem = clave => {
      const [id, modelo] = clave.split("::");
      return carrito.find(i => i.id === id && i.modelo === modelo);
    };
    const inc = e.target.closest("[data-inc]");
    if (inc) { const it = buscarItem(inc.dataset.inc); if (it) { it.cant++; guardarCarrito(); actualizarBadge(false); renderDrawer(); } return; }
    const dec = e.target.closest("[data-dec]");
    if (dec) {
      const it = buscarItem(dec.dataset.dec);
      if (it) { it.cant--; if (it.cant <= 0) carrito = carrito.filter(i => i !== it); guardarCarrito(); actualizarBadge(false); renderDrawer(); }
      return;
    }
    const del = e.target.closest("[data-del]");
    if (del) {
      const [id, modelo] = del.dataset.del.split("::");
      carrito = carrito.filter(i => !(i.id === id && i.modelo === modelo));
      guardarCarrito(); actualizarBadge(false); renderDrawer();
      return;
    }
    if (e.target.closest("[data-cerrar-carrito]")) cerrarCarrito();
  });

  /* ------------------------------------------------------------------------
     DRAWER + MENÚ MÓVIL (apertura, foco, Esc)
  ------------------------------------------------------------------------ */
  let ultimoFoco = null;
  let lenis = null;

  function bloquearScroll(bloquear) {
    document.body.classList.toggle("bloqueado", bloquear);
    if (lenis) bloquear ? lenis.stop() : lenis.start();
  }

  function atraparTab(contenedor, e) {
    if (e.key !== "Tab") return;
    const focables = $$('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])', contenedor)
      .filter(el => el.offsetParent !== null);
    if (!focables.length) return;
    const primero = focables[0], ultimo = focables[focables.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }

  const drawer = $("#drawerCarrito");
  const overlay = $("#overlay");

  function abrirCarrito() {
    ultimoFoco = document.activeElement;
    renderDrawer();
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add("abierto"));
    overlay.classList.add("visible");
    bloquearScroll(true);
    $("#btnCerrarCarrito").focus();
  }
  function cerrarCarrito() {
    drawer.classList.remove("abierto");
    overlay.classList.remove("visible");
    bloquearScroll(false);
    setTimeout(() => { drawer.hidden = true; }, 700);
    if (ultimoFoco) ultimoFoco.focus();
  }

  const menuMovil = $("#menuMovil");
  const btnMenu = $("#btnMenu");

  function abrirMenu() {
    ultimoFoco = document.activeElement;
    menuMovil.hidden = false;
    requestAnimationFrame(() => menuMovil.classList.add("abierto"));
    btnMenu.setAttribute("aria-expanded", "true");
    bloquearScroll(true);
    $("#btnCerrarMenu").focus();
  }
  function cerrarMenu() {
    menuMovil.classList.remove("abierto");
    btnMenu.setAttribute("aria-expanded", "false");
    bloquearScroll(false);
    setTimeout(() => { menuMovil.hidden = true; }, 850);
    if (ultimoFoco) ultimoFoco.focus();
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (drawer.classList.contains("abierto")) cerrarCarrito();
      if (menuMovil.classList.contains("abierto")) cerrarMenu();
    }
    if (drawer.classList.contains("abierto")) atraparTab(drawer, e);
    if (menuMovil.classList.contains("abierto")) atraparTab(menuMovil, e);
  });

  /* ------------------------------------------------------------------------
     NAVEGACIÓN SUAVE POR ANCLAS (+ filtros desde tiles/footer)
  ------------------------------------------------------------------------ */
  function irA(destino) {
    const el = typeof destino === "string" ? $(destino) : destino;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64,
                            behavior: reducedMotion ? "auto" : "smooth" });
  }

  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const destino = $(id);
    if (!destino) return;
    e.preventDefault();

    if (a.dataset.filtro) aplicarFiltro(a.dataset.filtro);
    if (menuMovil.classList.contains("abierto")) cerrarMenu();
    /* Pequeña espera si el menú estaba abierto (libera el scroll) */
    setTimeout(() => irA(destino), menuMovil.classList.contains("abierto") ? 350 : 0);
    history.replaceState(null, "", id);
  });

  /* ------------------------------------------------------------------------
     HEADER AL SCROLL + WHATSAPP FLOTANTE
  ------------------------------------------------------------------------ */
  function alScroll() {
    const y = window.scrollY;
    $("#header").classList.toggle("scrolado", y > 40);
    $("#waFloat").classList.toggle("visible", y > window.innerHeight * 0.85);
  }
  window.addEventListener("scroll", alScroll, { passive: true });

  /* ------------------------------------------------------------------------
     HERO: VIDEO CON CROSSFADE (poster animado si no puede cargar)
  ------------------------------------------------------------------------ */
  function iniciarHeroVideo() {
    const video = $("#heroVideo");
    if (!video || reducedMotion) { if (video) video.remove(); return; }

    const conn = navigator.connection || {};
    if (conn.saveData) { video.remove(); return; }

    const esMovil = window.innerWidth < 768;
    let fuentes = CONFIG.heroVideos.slice();
    if (esMovil) {
      if (CONFIG.heroVideoMovil && conn.effectiveType === "4g") fuentes = [CONFIG.heroVideoMovil];
      else { video.remove(); return; } // móvil: poster con Ken Burns
    }
    if (!fuentes.length) { video.remove(); return; }

    let indice = 0;
    const videos = [video];
    if (fuentes.length > 1) { // segundo elemento para el crossfade
      const clon = video.cloneNode();
      clon.removeAttribute("id");
      video.after(clon);
      videos.push(clon);
    }
    let actual = 0;

    const cargar = (el, src) => { el.src = src; el.load(); };
    const reproducir = el => { const p = el.play(); if (p) p.catch(() => {}); };

    videos.forEach(el => {
      el.addEventListener("canplay", () => { el.classList.add("activo"); reproducir(el); });
      el.addEventListener("error", () => { el.classList.remove("activo"); el.removeAttribute("src"); }, true);
      el.addEventListener("ended", () => {
        if (fuentes.length < 2) return;
        indice = (indice + 1) % fuentes.length;
        const siguiente = videos[1 - actual];
        cargar(siguiente, fuentes[indice]);
        siguiente.classList.add("activo");
        reproducir(siguiente);
        el.classList.remove("activo");
        actual = 1 - actual;
      });
    });

    if (fuentes.length < 2) videos[0].loop = true;
    cargar(videos[0], fuentes[0]);

    /* Pausar fuera de pantalla (performance) */
    const io = new IntersectionObserver(([e]) => {
      videos.forEach(el => {
        if (!el.src) return;
        if (e.isIntersecting) reproducir(el); else el.pause();
      });
    }, { threshold: 0.05 });
    io.observe($("#inicio"));
  }

  /* ------------------------------------------------------------------------
     PRELOADER (máx ~1.8s) + INTRO DEL HERO
  ------------------------------------------------------------------------ */
  const inicioCarga = performance.now();
  function cerrarPreloader() {
    const pre = $("#preloader");
    if (!pre || pre.dataset.listo) return;
    pre.dataset.listo = "1";
    const espera = Math.max(0, 1100 - (performance.now() - inicioCarga));
    setTimeout(() => {
      pre.classList.add("sale");
      document.body.classList.remove("bloqueado");
      if (lenis) lenis.start();
      introHero();
      setTimeout(() => pre.remove(), 1100);
    }, reducedMotion ? 0 : espera);
  }
  window.addEventListener("load", cerrarPreloader);
  setTimeout(cerrarPreloader, 2400); // red de seguridad

  /* ------------------------------------------------------------------------
     MOVIMIENTO: LENIS + GSAP
  ------------------------------------------------------------------------ */
  function iniciarLenis() {
    if (reducedMotion || !window.Lenis) return;
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(t => lenis.raf(t * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    lenis.stop(); // hasta que salga el preloader
    document.body.classList.add("bloqueado");
  }

  function introHero() {
    if (!window.gsap || reducedMotion) return;
    const tl = window.gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero .mask-line > span", { yPercent: 118, duration: 1.25, stagger: 0.13 }, 0.05)
      .from("[data-hero]", { y: 34, opacity: 0, duration: 1, stagger: 0.12 }, 0.35)
      .from(".scroll-ind", { opacity: 0, duration: 0.8 }, 0.9);
  }

  function iniciarAnimaciones() {
    if (!window.gsap || !window.ScrollTrigger || reducedMotion) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    /* Títulos con máscara, línea por línea */
    $$(".mask-title").forEach(titulo => {
      if (titulo.closest(".hero")) return; // el hero tiene su propia intro
      gsap.from($$(".mask-line > span", titulo), {
        yPercent: 118, duration: 1.15, ease: "power4.out", stagger: 0.12,
        scrollTrigger: { trigger: titulo, start: "top 86%" }
      });
    });

    /* Reveals suaves genéricos */
    $$("[data-reveal]").forEach(el => {
      if (el.classList.contains("tile")) return; // los tiles se animan abajo
      gsap.from(el, {
        y: 38, opacity: 0, duration: 1.05, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        onStart: () => { el.style.transition = "none"; },
        onComplete: () => { el.style.transition = ""; }
      });
    });

    /* Tiles: la imagen se revela con clip-path que se abre */
    $$(".tile").forEach((tile, i) => {
      const media = tile.querySelector(".tile-media");
      gsap.fromTo(media,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut", delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: tile, start: "top 88%" },
          onStart: () => { media.style.transition = "none"; },
          onComplete: () => { media.style.clipPath = ""; media.style.transition = ""; } });
      gsap.from(tile.querySelector(".tile-info"), {
        y: 26, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.45,
        scrollTrigger: { trigger: tile, start: "top 88%" }
      });
    });

    /* Parallax leve en imágenes marcadas */
    $$("[data-parallax]").forEach(img => {
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7, ease: "none",
        scrollTrigger: { trigger: img.closest("[data-parallax-wrap]") || img, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* Línea dorada de “Cómo comprar” que se dibuja */
    gsap.fromTo("#pasos", { "--pl": 0 }, {
      "--pl": 1, duration: 1.8, ease: "power3.inOut",
      scrollTrigger: { trigger: "#pasos", start: "top 78%" }
    });

    /* Fondo del hero con parallax al salir */
    gsap.to(".hero-media", {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ------------------------------------------------------------------------
     BOTONES MAGNÉTICOS + CURSOR (solo desktop)
  ------------------------------------------------------------------------ */
  function iniciarMagneticos() {
    if (!punteroFino || reducedMotion) return;
    $$(".magnetico").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transition = "transform .25s var(--ease), color .5s var(--ease), border-color .5s var(--ease), background-color .5s var(--ease)";
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transition = "transform .6s var(--ease), color .5s var(--ease), border-color .5s var(--ease), background-color .5s var(--ease)";
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  function iniciarCursor() {
    if (!punteroFino || reducedMotion) return;
    const punto = $(".cursor-punto"), halo = $(".cursor-halo");
    let mx = -100, my = -100, hx = -100, hy = -100, visible = false;

    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      punto.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      if (!visible) { visible = true; punto.style.opacity = 1; halo.style.opacity = 1; hx = mx; hy = my; }
    });
    document.addEventListener("mouseleave", () => { visible = false; punto.style.opacity = 0; halo.style.opacity = 0; });
    document.addEventListener("mousedown", () => halo.classList.add("aprieta"));
    document.addEventListener("mouseup",   () => halo.classList.remove("aprieta"));

    const interactivo = "a, button, select, input, .tile, .card-media, .led-media, .chip";
    document.addEventListener("mouseover", e => {
      halo.classList.toggle("crece", !!e.target.closest(interactivo));
    });

    (function animar() {
      hx += (mx - hx) * 0.16; hy += (my - hy) * 0.16;
      halo.style.transform = `translate(${hx}px, ${hy}px) translate(-50%,-50%)`;
      requestAnimationFrame(animar);
    })();
  }

  /* ------------------------------------------------------------------------
     MARQUEE: duplicar contenido para loop perfecto
  ------------------------------------------------------------------------ */
  function iniciarMarquee() {
    const track = $("#marqueeTrack");
    if (!track) return;
    const copia = track.innerHTML;
    const extra = document.createElement("template");
    track.insertAdjacentHTML("beforeend", copia);
    Array.from(track.children).slice(track.children.length / 2)
      .forEach(el => el.setAttribute("aria-hidden", "true"));
    void extra;
  }

  /* ------------------------------------------------------------------------
     ARRANQUE
  ------------------------------------------------------------------------ */
  function init() {
    renderConteos();
    renderDestacados();
    renderLED();
    iniciarCatalogo();
    iniciarCarrusel();
    iniciarMarquee();
    renderDrawer();
    actualizarBadge(false);
    iniciarHeroVideo();
    iniciarLenis();
    iniciarAnimaciones();
    iniciarMagneticos();
    iniciarCursor();
    alScroll();

    $("#btnAbrirCarrito").addEventListener("click", abrirCarrito);
    $("#btnCerrarCarrito").addEventListener("click", cerrarCarrito);
    $("#btnSeguir").addEventListener("click", cerrarCarrito);
    $("#btnFinalizar").addEventListener("click", finalizarPorWhatsApp);
    $("#toastVer").addEventListener("click", () => { $("#toast").classList.remove("visible"); abrirCarrito(); });
    overlay.addEventListener("click", cerrarCarrito);
    btnMenu.addEventListener("click", abrirMenu);
    $("#btnCerrarMenu").addEventListener("click", cerrarMenu);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
