#!/usr/bin/env node
// Genera los PNG de marca (ícono, adaptive icon de Android, splash, favicon)
// desde HTML/CSS con Chrome headless. La marca es la variante C del design
// system: una card de vidrio con una "n" en Nunito Black sobre una malla con
// los colores de la paleta. Uso: node scripts/brand/render.mjs
// Requiere Google Chrome (ruta por defecto de macOS o variable CHROME).
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = 'assets/images';
const FONT = readFileSync(
  'node_modules/@expo-google-fonts/nunito/900Black/Nunito_900Black.ttf',
).toString('base64');

// Malla de la marca: un color de cada familia principal sobre lavanda.
const MESH =
  'radial-gradient(circle at 10% 10%, #FF9EAA 0%, #FF9EAA00 55%),' +
  'radial-gradient(circle at 95% 20%, #BB91FF 0%, #BB91FF00 55%),' +
  'radial-gradient(circle at 80% 95%, #07BDE5 0%, #07BDE500 55%),' +
  'radial-gradient(circle at 5% 95%, #F8C153 0%, #F8C15300 55%), #C7CDFF';
const INK = '#242454';

/** Card inclinada con la "n". `s` es el ancho de la card; el resto es proporcional. */
function card(s, { glass = true, mono = false } = {}) {
  const look = mono
    ? `background: transparent; border: ${s * 0.07}px solid #FFF; color: #FFF;`
    : glass
      ? `background: rgba(255,255,255,0.45); border: ${s * 0.022}px solid rgba(255,255,255,0.9); color: ${INK};`
      : `background: ${MESH}; color: ${INK}; box-shadow: 0 ${s * 0.06}px ${s * 0.16}px -${s * 0.05}px rgba(98,96,209,0.55);`;
  return `<div style="position:absolute; left:50%; top:50%; width:${s}px; height:${s * 1.26}px;
    transform: translate(-50%,-50%) rotate(-8deg); border-radius:${s * 0.3}px; box-sizing:border-box; ${look}
    display:flex; align-items:center; justify-content:center; font: 900 ${s * 0.83}px/1 Nunito;
    padding-bottom:${s * 0.12}px">n</div>`;
}

const page = (size, body, background = 'transparent') => `<!doctype html><html><head><style>
  @font-face { font-family: Nunito; src: url(data:font/ttf;base64,${FONT}); font-weight: 900; }
  html, body { margin:0; width:${size}px; height:${size}px; overflow:hidden; background:${background}; }
</style></head><body><div style="position:relative; width:${size}px; height:${size}px">${body}</div></body></html>`;

const ASSETS = [
  // iOS: cuadrado, opaco, sin esquinas redondeadas (el sistema aplica la máscara).
  { file: 'icon.png', size: 1024, opaque: true, html: page(1024, card(522), MESH) },
  // Android adaptive: fondo de malla opaco + card translúcida dentro del círculo seguro (66/108 dp).
  { file: 'android-icon-background.png', size: 1024, opaque: true, html: page(1024, '', MESH) },
  { file: 'android-icon-foreground.png', size: 1024, html: page(1024, card(380)) },
  { file: 'android-icon-monochrome.png', size: 1024, html: page(1024, card(380, { mono: true })) },
  // Splash: la card con malla propia (no vidrio: el fondo del splash es plano).
  { file: 'splash-icon.png', size: 1024, html: page(1024, card(560, { glass: false })) },
  // Favicon: la malla a sangre con la "n" derecha.
  {
    file: 'favicon.png',
    size: 48,
    html: page(
      48,
      `<div style="width:48px;height:48px;border-radius:12px;background:${MESH};color:${INK};display:flex;align-items:center;justify-content:center;font:900 38px/1 Nunito;padding-bottom:5px;box-sizing:border-box">n</div>`,
    ),
  },
];

// --- PNG: quitar el canal alfa (iOS rechaza íconos con transparencia) --------
const crcTable = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf) => {
  let c = -1;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function dropAlpha(png) {
  const w = png.readUInt32BE(16);
  const h = png.readUInt32BE(20);
  if (png[24] !== 8 || png[25] !== 6) return png; // solo RGBA de 8 bits
  const idat = [];
  for (let o = 8; o < png.length;) {
    const len = png.readUInt32BE(o);
    if (png.toString('ascii', o + 4, o + 8) === 'IDAT') idat.push(png.subarray(o + 8, o + 8 + len));
    o += len + 12;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * 4;
  const px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? px[y * stride + x - 4] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= 4 && y > 0 ? px[(y - 1) * stride + x - 4] : 0;
      const p = a + b - c;
      const pr =
        Math.abs(p - a) <= Math.abs(p - b) && Math.abs(p - a) <= Math.abs(p - c)
          ? a
          : Math.abs(p - b) <= Math.abs(p - c)
            ? b
            : c;
      const v = line[x];
      px[y * stride + x] =
        (f === 0 ? v : f === 1 ? v + a : f === 2 ? v + b : f === 3 ? v + ((a + b) >> 1) : v + pr) &
        0xff;
    }
  }
  const rgb = Buffer.alloc(h * (w * 3 + 1));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      px.copy(rgb, y * (w * 3 + 1) + 1 + x * 3, y * stride + x * 4, y * stride + x * 4 + 3);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rgb, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Chrome DevTools Protocol, lo mínimo ----------------------------------------
const PORT = 9444;
const profile = mkdtempSync(join(tmpdir(), 'nombrame-brand-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets = [];
for (let i = 0; i < 50 && !targets.length; i++) {
  try {
    targets = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).filter(
      (t) => t.type === 'page',
    );
  } catch {}
  await sleep(200);
}
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) (pending.get(m.id)(m), pending.delete(m.id));
});
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, (m) =>
      m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result),
    );
    ws.send(JSON.stringify({ id: i, method, params }));
  });

try {
  await send('Page.enable');
  await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  for (const a of ASSETS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: a.size,
      height: a.size,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', {
      url: `data:text/html;base64,${Buffer.from(a.html).toString('base64')}`,
    });
    await sleep(600);
    await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    let png = Buffer.from(data, 'base64');
    if (a.opaque) png = dropAlpha(png);
    writeFileSync(join(OUT, a.file), png);
    console.log(`${a.file} ${a.size}×${a.size}${a.opaque ? ' opaco' : ''}`);
  }
} finally {
  ws.close();
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
