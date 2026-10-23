
'use strict';

// ========================================
// 1. VARIABLES Y OPCIONES
// ========================================

const $ = id => document.getElementById(id);

const colors = [
  '#f65ac5',
  '#47d9ff',
  '#a877ff',
  '#48e6ac',
  '#ffae4f',
  '#ff6a79'
];

const hairs = [
  ...Array.from(
    { length: 26 },
    (_, i) => `long${String(i + 1).padStart(2, '0')}`
  ),
  ...Array.from(
    { length: 19 },
    (_, i) => `short${String(i + 1).padStart(2, '0')}`
  )
];

const palettes = {
  hairColor: [
    ['Castaño', '#593a2b'],
    ['Negro', '#221b24'],
    ['Rubio', '#e8bb72'],
    ['Rojizo', '#a85138'],
    ['Rosa', '#ee71ad'],
    ['Violeta', '#8754bb'],
    ['Azul', '#438cc7']
  ],

  skin: [
    ['Claro', '#f5d4b4'],
    ['Beige', '#e6b98d'],
    ['Trigueño', '#c99165'],
    ['Moreno', '#9c6249'],
    ['Oscuro', '#65402f']
  ],

  eyes: Array.from(
    { length: 26 },
    (_, i) => [
      `Mirada ${String(i + 1).padStart(2, '0')}`,
      `variant${String(i + 1).padStart(2, '0')}`
    ]
  ),

  mouth: Array.from(
    { length: 30 },
    (_, i) => [
      `Expresión ${String(i + 1).padStart(2, '0')}`,
      `variant${String(i + 1).padStart(2, '0')}`
    ]
  )
};

const initialState = {
  alias: 'PLAYER 01',
  role: 'PROGRAMADOR/A WEB',
  hair: 'long01',
  hairColor: '593a2b',
  skin: 'e6b98d',
  eyes: 'variant01',
  mouth: 'variant01',
  glasses: '0',
  accent: colors[0]
};

const state = { ...initialState };

// ========================================
// 2. CARGAR OPCIONES
// ========================================

function populate(id, items) {
  const select = $(id);

  for (const [label, value] of items) {
    const option = document.createElement('option');

    option.value = value;
    option.textContent = label;

    select.append(option);
  }
}

populate(
  'hair',
  hairs.map(x => [
    `${x.startsWith('long') ? 'Largo' : 'Corto'} ${x.slice(-2)}`,
    x
  ])
);

for (const id of ['hairColor', 'skin', 'eyes', 'mouth']) {
  populate(
    id,
    palettes[id].map(([label, value]) => [
      label,
      value.replace('#', '')
    ])
  );
}

// ========================================
// 3. SELECTORES CON FLECHAS
// ========================================

// Estos tres campos tendrán botones
// anterior / siguiente y teclado.
const arrowFields = [
  'hair',
  'hairColor',
  'skin',
  'eyes',
  'mouth',
  'glasses'
];

const arrowControls = {};

function changeOption(id, direction) {
  const select = $(id);
  const total = select.options.length;

  if (!total) return;

  let index = select.selectedIndex;

  index = (index + direction + total) % total;

  select.selectedIndex = index;
  state[id] = select.value;

  updateArrowControl(id);
  render();
}

function updateArrowControl(id) {
  const select = $(id);
  const control = arrowControls[id];

  if (!control) return;

  const index = select.selectedIndex;
  const total = select.options.length;

  if (index < 0) return;

  control.text.textContent =
    select.options[index].textContent;

  control.counter.textContent =
    `${index + 1} de ${total}`;
}

function createArrowControl(id) {
  const select = $(id);

  // Ocultamos la lista original,
  // pero la conservamos para el sistema.
  select.style.display = 'none';

  const wrapper = document.createElement('div');

  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'group');

  wrapper.setAttribute(
    'aria-label',
    `Selector de ${id}. Usá flecha izquierda o derecha.`
  );

  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 5px;
    margin-bottom: 8px;
    border: 1px solid #3a496f;
    border-radius: 12px;
    background: #0c1429;
    color: white;
    outline-offset: 3px;
  `;

  const previous = document.createElement('button');

  previous.type = 'button';
  previous.textContent = '◀';
  previous.title = 'Anterior';

  const next = document.createElement('button');

  next.type = 'button';
  next.textContent = '▶';
  next.title = 'Siguiente';

  for (const button of [previous, next]) {
    button.style.cssText = `
      padding: 10px 13px;
      min-width: 42px;
      border-radius: 8px;
      border: 1px solid #465982;
      background: #192744;
      color: white;
      font-size: 15px;
      cursor: pointer;
    `;
  }

  const center = document.createElement('div');

  center.style.cssText = `
    flex: 1;
    min-width: 0;
    text-align: center;
    user-select: none;
  `;

  const text = document.createElement('div');

  text.style.cssText = `
    font-size: 13px;
    font-weight: 800;
    color: #ffffff;
  `;

  const counter = document.createElement('div');

  counter.style.cssText = `
    margin-top: 3px;
    font-size: 10px;
    color: #aab8d1;
  `;

  center.append(text, counter);
  wrapper.append(previous, center, next);

  // Colocamos el control donde estaba la lista.
  select.insertAdjacentElement('afterend', wrapper);

  arrowControls[id] = {
    wrapper,
    text,
    counter
  };

  // Botones para mouse o pantalla táctil.
  previous.onclick = () => {
    changeOption(id, -1);
    wrapper.focus();
  };

  next.onclick = () => {
    changeOption(id, 1);
    wrapper.focus();
  };

  // Flechas del teclado.
  wrapper.addEventListener('keydown', event => {
    if (
      event.key === 'ArrowRight' ||
      event.key === 'ArrowDown'
    ) {
      event.preventDefault();
      changeOption(id, 1);
    }

    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowUp'
    ) {
      event.preventDefault();
      changeOption(id, -1);
    }
  });

  updateArrowControl(id);
}

// Crear los tres controles.
for (const id of arrowFields) {
  createArrowControl(id);
}

// ========================================
// 4. SINCRONIZAR FORMULARIO
// ========================================

function setForm() {
  for (const id of [
    'alias',
    'role',
    'hair',
    'hairColor',
    'skin',
    'eyes',
    'mouth',
    'glasses'
  ]) {
    $(id).value = state[id];
  }

  document.querySelectorAll('.swatch').forEach(btn => {
    btn.classList.toggle(
      'active',
      btn.dataset.color === state.accent
    );
  });

  for (const id of arrowFields) {
    updateArrowControl(id);
  }
}

// ========================================
// 5. COLORES DE LA CREDENCIAL
// ========================================

for (const color of colors) {
  const btn = document.createElement('button');

  btn.type = 'button';
  btn.className = 'swatch';
  btn.style.background = color;
  btn.dataset.color = color;

  btn.setAttribute(
    'aria-label',
    'Elegir color ' + color
  );

  btn.onclick = () => {
    state.accent = color;
    setForm();
    render();
  };

  $('palette').append(btn);
}

// ========================================
// 6. EVENTOS DEL FORMULARIO
// ========================================

// Los tres selectores con flechas ya
// tienen sus propios eventos.

for (const id of [
  'alias',
  'role'
]) {
  const eventType =
    id === 'alias' || id === 'role'
      ? 'input'
      : 'change';

  $(id).addEventListener(eventType, event => {
    state[id] = event.target.value;
    render();
  });
}

// ========================================
// 7. GENERAR AVATAR CON DICEBEAR
// ========================================

function avatarUrl() {
  const params = new URLSearchParams({
    seed: 'SanPio2026',
    hair: state.hair,
    hairColor: state.hairColor,
    skinColor: state.skin,
    eyes: state.eyes,
    mouth: state.mouth,
    glassesProbability:
      state.glasses === '1' ? '100' : '0',
    size: '512'
  });

  return (
    'https://api.dicebear.com/9.x/adventurer/svg?' +
    params.toString()
  );
}

let loadedUrl = '';
let pending = 0;

// ========================================
// 8. ACTUALIZAR VISTA PREVIA
// ========================================

function render() {
  state.alias = state.alias.slice(0, 22);

  $('displayAlias').textContent =
    state.alias.trim() || 'PLAYER 01';

  $('displayRole').textContent = state.role;

  $('card').style.setProperty(
    '--accent',
    state.accent
  );

  $('qrPanel').hidden = true;

  const url = avatarUrl();

  if (url === loadedUrl) return;

  const request = ++pending;

  $('loading').hidden = false;

  $('loading').textContent = 'Cargando personaje…';

  $('status').textContent =
    'Cargando personaje desde DiceBear…';

  const img = new Image();

  img.crossOrigin = 'anonymous';

  img.onload = () => {
    if (request !== pending) return;

    $('avatar').src = url;

    loadedUrl = url;

    $('loading').hidden = true;

    $('status').textContent =
      '¡Listo! Personalizá y descargá tu credencial.';
  };

  img.onerror = () => {
    if (request !== pending) return;

    $('loading').textContent =
      'No se pudo cargar el avatar';

    $('status').textContent =
      'Para mostrar los avatares necesitás conexión a internet.';
  };

  img.src = url;
}

// ========================================
// 9. PERSONAJE ALEATORIO
// ========================================

function randomItem(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}

$('random').onclick = () => {
  state.hair = randomItem(hairs);

  state.hairColor =
    randomItem(palettes.hairColor)[1].slice(1);

  state.skin =
    randomItem(palettes.skin)[1].slice(1);

  state.eyes =
    randomItem(palettes.eyes)[1];

  state.mouth =
    randomItem(palettes.mouth)[1];

  state.glasses =
    Math.random() > 0.6 ? '1' : '0';

  state.accent = randomItem(colors);

  setForm();
  render();
};

// ========================================
// 10. REINICIAR PERSONAJE
// ========================================

$('reset').onclick = () => {
  Object.assign(state, initialState);

  setForm();
  render();
};

// ========================================
// 11. FUNCIONES PARA DIBUJAR
// ========================================

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);

    img.onerror = () => {
      reject(
        new Error('No se pudo descargar la ilustración')
      );
    };

    img.src = url;
  });
}

// ========================================
// 12. GENERAR CREDENCIAL PNG
// ========================================

async function drawCard() {
  const canvas = document.createElement('canvas');

  canvas.width = 900;
  canvas.height = 1320;

  const c = canvas.getContext('2d');

  // Fondo
  const bg = c.createLinearGradient(
    0, 0, 900, 1320
  );

  bg.addColorStop(0, '#18264e');
  bg.addColorStop(1, '#080d21');

  c.fillStyle = bg;
  c.fillRect(0, 0, 900, 1320);

  // Borde
  c.strokeStyle = state.accent;
  c.lineWidth = 9;
  c.strokeRect(22, 22, 856, 1276);

  // Encabezado
  c.textAlign = 'center';

  c.fillStyle = '#85e9ff';
  c.font = 'bold 25px Arial';

  c.fillText(
    'INSTITUTO DE EDUCACIÓN SUPERIOR SAN PÍO DE PIETRELCINA',
    450, 95, 790
  );

  c.fillStyle = '#ffffff';
  c.font = 'bold 55px Arial';

  c.fillText(
    'FERIA DE CIENCIAS 2026',
    450, 167, 790
  );

  // Fondo del avatar
  c.textAlign = 'left';

  roundRect(
    c, 65, 205, 770, 715, 28,
    '#202d59'
  );

  const glow = c.createRadialGradient(
    450, 555, 10,
    450, 555, 350
  );

  glow.addColorStop(0, state.accent + '99');
  glow.addColorStop(1, '#202d5900');

  c.fillStyle = glow;
  c.fillRect(65, 205, 770, 715);

  // Avatar
  const img = await loadImage(avatarUrl());

  c.drawImage(img, 120, 255, 660, 660);

  // Identidad
  c.fillStyle = '#ff85d7';
  c.font = 'bold 21px Arial';

  c.fillText(
    'IDENTIDAD DESBLOQUEADA',
    70, 965
  );

  // Nombre
  c.fillStyle = '#ffffff';

  const alias =
    state.alias.trim() || 'PLAYER 01';

  c.font = `bold ${
    alias.length > 17 ? 42 : 56
  }px Arial`;

  c.fillText(alias, 70, 1030, 750);

  // Profesión
  c.fillStyle = state.accent;
  c.font = 'bold 27px Arial';

  c.fillText(
    state.role,
    70, 1080, 750
  );

  // Panel inferior
  roundRect(
    c, 65, 1110, 770, 135, 18,
    '#21375e'
  );

  c.fillStyle = '#ffffff';
  c.font = 'bold 25px Arial';

  c.fillText(
    '¡YO PARTICIPÉ EN LA FERIA DE CIENCIAS 2026!',
    93, 1159, 710
  );

  c.fillStyle = '#85e9ff';

  c.fillText(
    'TEC. SUPERIOR EN DESARROLLO DE SOFTWARE',
    93, 1193, 710
  );

  c.fillStyle = '#b8c8e5';
  c.font = '17px Arial';

  c.fillText(
    'LO QUE IMAGINÁS, PODÉS PROGRAMARLO.',
    93, 1224, 710
  );

  return canvas;
}

// ========================================
// 13. DESCARGAR CREDENCIAL
// ========================================

$('download').onclick = async () => {
  try {
    $('status').textContent =
      'Preparando imagen…';

    const canvas = await drawCard();

    const link = document.createElement('a');

    link.download =
      'Identidad_Digital_San_Pio_2026.png';

    link.href = canvas.toDataURL('image/png');

    link.click();

    $('status').textContent =
      '¡Credencial descargada!';

  } catch (error) {
    $('status').textContent =
      'No se pudo exportar. Revisá tu conexión.';

    console.error(error);
  }
};

// ========================================
// 14. COMPARTIR AVATAR POR QR
// ========================================

function shareUrl() {
  if (location.protocol === 'file:') {
    return null;
  }

  const url = new URL(location.href);

  url.search = '';

  const data = {};

  for (const key of Object.keys(state)) {
    data[key] = state[key];
  }

  url.searchParams.set(
    'avatar',
    encodeURIComponent(JSON.stringify(data))
  );

  return url.href;
}

$('share').onclick = () => {
  const url = shareUrl();

  if (!url) {
    alert(
      'Para generar un QR, primero publicá el proyecto en GitHub Pages.'
    );
    return;
  }

  const qr =
    'https://api.qrserver.com/v1/create-qr-code/' +
    '?size=240x240&data=' +
    encodeURIComponent(url);

  $('qr').src = qr;
  $('qrPanel').hidden = false;

  $('qrPanel').scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
};

// ========================================
// 15. COPIAR ENLACE
// ========================================

$('copy').onclick = async () => {
  const url = shareUrl();

  if (!url) return;

  try {
    await navigator.clipboard.writeText(url);

    $('copy').textContent =
      '✓ Enlace copiado';

  } catch {
    prompt('Copiá el enlace:', url);
  }
};

// ========================================
// 16. RECUPERAR AVATAR DESDE QR
// ========================================

try {
  const query = new URLSearchParams(
    location.search
  ).get('avatar');

  if (query) {
    const data = JSON.parse(
      decodeURIComponent(query)
    );

    for (const key of Object.keys(state)) {
      if (typeof data[key] === 'string') {
        state[key] = data[key].slice(
          0,
          key === 'alias' ? 22 : 100
        );
      }
    }

    if (!colors.includes(state.accent)) {
      state.accent = colors[0];
    }

    if (!hairs.includes(state.hair)) {
      state.hair = 'long01';
    }

    if (!palettes.eyes.some(
      item => item[1] === state.eyes
    )) {
      state.eyes = 'variant01';
    }

    if (!palettes.mouth.some(
      item => item[1] === state.mouth
    )) {
      state.mouth = 'variant01';
    }

    if (!['0', '1'].includes(state.glasses)) {
      state.glasses = '0';
    }
  }

} catch (error) {
  console.warn(
    'Enlace de avatar inválido',
    error
  );
}

// ========================================
// 17. INICIAR
// ========================================

setForm();
render();
