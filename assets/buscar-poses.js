/* Filtro de poses de Opsi (páginas /opsi/poses/…). Mejora progresiva: sin JavaScript la caja no aparece y quedan las categorías y los chips.
   Lee assets/poses.json y muestra las poses de TODAS las categorías que coinciden con lo escrito; mientras haya algo escrito oculta lo marcado con data-filtrable. */
(function () {
  var form = document.querySelector('form.buscador[data-poses]');
  if (!form) return;
  var rel = form.getAttribute('data-rel') || '';
  var caja = document.getElementById('q-poses'), limpiar = document.getElementById('q-limpiar'), res = document.getElementById('r-poses');
  var datos = null, cargando = false;
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function ocultarLista(oculto) {
    document.querySelectorAll('[data-filtrable]').forEach(function (el) { el.hidden = oculto; });
  }
  function pintar() {
    var q = norm(caja.value).trim();
    if (!q) { res.hidden = true; res.innerHTML = ''; ocultarLista(false); return; }
    if (!datos) { if (!cargando) cargar(); return; }
    var palabras = q.split(/\s+/);
    var L = datos.filter(function (p) { var t = norm(p.q); return palabras.every(function (w) { return t.indexOf(w) >= 0; }); });
    ocultarLista(true); res.hidden = false;
    if (!L.length) { res.innerHTML = '<p class="bajada">Ninguna pose coincide con «' + esc(caja.value.trim()) + '». Prueba otra palabra o pulsa «Limpiar».</p>'; return; }
    res.innerHTML = '<p class="bajada">' + L.length + (L.length === 1 ? ' pose coincide' : ' poses coinciden') + '. Toca «Descargar» para bajar la pegatina.</p><ul class="descargas">' + L.map(function (p) {
      return '<li class="descarga"><img src="' + rel + 'assets/opsi/' + esc(p.i) + '.webp" alt="' + esc(p.a) + '" loading="lazy" decoding="async"><span>' + esc(p.t) + '</span>' +
        '<a class="boton" href="' + rel + 'assets/pegatinas/' + esc(p.i) + '.png" download="' + esc(p.i) + '.png" aria-label="Descargar la pegatina: ' + esc(p.t.toLowerCase()) + '">Descargar</a></li>';
    }).join('') + '</ul>';
  }
  function cargar() {
    cargando = true;
    fetch(form.getAttribute('data-poses')).then(function (r) { return r.json(); }).then(function (d) { datos = d; cargando = false; pintar(); }).catch(function () { cargando = false; });
  }
  form.hidden = false;
  caja.addEventListener('input', pintar);
  limpiar.addEventListener('click', function () { caja.value = ''; pintar(); caja.focus(); });
})();
