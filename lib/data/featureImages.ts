/* ==================================================================
   Feature imagery.

   Two tiers, on purpose:

   1. VERIFIED_IMAGES — a real photograph of the actual place, resolved
      from Wikimedia Commons and checked so that the file's name shares a
      stem with the feature. Only ~3 dozen features have one, because
      anything we could not verify was deliberately left out: a wrong
      photo of a real mountain teaches the wrong thing.

   2. illustratedPlate(type) — an engraved atlas plate drawn in SVG for
      everything else. It is obviously an illustration, never posing as a
      photograph, and it inherits the antique-cartography palette.

   Attribution: all photographs come from Wikimedia Commons under their
   respective free licences. See the URL for the file page.
   ================================================================== */

/** id → Wikimedia Commons thumbnail (900px) */
export const VERIFIED_IMAGES: Record<string, string> = {
  'ac-zeugma':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Acheloos%2C_detail_of_roman_mosaic_from_Zeugma.jpg/960px-Acheloos%2C_detail_of_roman_mosaic_from_Zeugma.jpg',
  'bg-sarp':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Sarp_S%C4%B1n%C4%B1r_Kap%C4%B1s%C4%B1_-_panoramio.jpg/960px-Sarp_S%C4%B1n%C4%B1r_Kap%C4%B1s%C4%B1_-_panoramio.jpg',
  'cv-cal':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/%C3%87al_Magaras%C4%B1.jpg/960px-%C3%87al_Magaras%C4%B1.jpg',
  'cv-damlatas':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Damlata%C5%9F_Cave.jpg/960px-Damlata%C5%9F_Cave.jpg',
  'cv-dim':
    'https://upload.wikimedia.org/wikipedia/commons/b/bb/DIMMAGARASI.JPG',
  'cv-dupnisa':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/DupnisaCave_%2817%29.JPG/960px-DupnisaCave_%2817%29.JPG',
  'cv-gokgol':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/G%C3%B6kg%C3%B6l_gate.jpg/960px-G%C3%B6kg%C3%B6l_gate.jpg',
  'cv-kaklik':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Kakl%C4%B1k_Ma%C4%9Faras%C4%B1.jpg/960px-Kakl%C4%B1k_Ma%C4%9Faras%C4%B1.jpg',
  'cv-karain':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Karain.JPG/960px-Karain.JPG',
  'cv-oylat':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Bursa%2C_Oylat_da%C4%9F%C4%B1.jpg/960px-Bursa%2C_Oylat_da%C4%9F%C4%B1.jpg',
  'cv-tinaztepe':
    'https://upload.wikimedia.org/wikipedia/commons/a/a5/T%C4%B1naztepe_.Ma%C4%9Faralar%C4%B1.jpg',
  'l-abant':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Abant_6.JPG/960px-Abant_6.JPG',
  'l-beysehir':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Bey%C5%9Fehir_G%C3%B6l%C3%BC_Akburun_3.jpg/960px-Bey%C5%9Fehir_G%C3%B6l%C3%BC_Akburun_3.jpg',
  'l-buyukcekmece':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/B%C3%BCy%C3%BCk_%C3%87ekmece_Do%C4%9Fal_Ya%C5%9Fam_Park%C4%B11.jpg/960px-B%C3%BCy%C3%BCk_%C3%87ekmece_Do%C4%9Fal_Ya%C5%9Fam_Park%C4%B11.jpg',
  'l-hazar':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Lake_Hazar_and_Mount_Hazar_Baba.jpg/960px-Lake_Hazar_and_Mount_Hazar_Baba.jpg',
  'l-kucukcekmece':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/K%C3%BC%C3%A7%C3%BCk%C3%A7ekmece_G%C3%B6l%C3%BC.jpg/960px-K%C3%BC%C3%A7%C3%BCk%C3%A7ekmece_G%C3%B6l%C3%BC.jpg',
  'l-sapanca':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Sapanca-golu_2013.jpg/960px-Sapanca-golu_2013.jpg',
  'l-yedigoller':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/TR_Yedig%C3%B6ller_asv2021-10_img02.jpg/960px-TR_Yedig%C3%B6ller_asv2021-10_img02.jpg',
  'm-agri':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/A%C4%9Fr%C4%B1_Da%C4%9F%C4%B1_DSC_1045.jpg/960px-A%C4%9Fr%C4%B1_Da%C4%9F%C4%B1_DSC_1045.jpg',
  'm-aladaglar':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Alada%C4%9Flara_Bak%C4%B1%C5%9F.jpg/960px-Alada%C4%9Flara_Bak%C4%B1%C5%9F.jpg',
  'm-bozdaglar':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Ayd%C4%B1n_da%C4%9Flar%C4%B1_Boz_da%C4%9Flar.jpg/960px-Ayd%C4%B1n_da%C4%9Flar%C4%B1_Boz_da%C4%9Flar.jpg',
  'm-erciyes':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Develiden_Erciyes.jpg/960px-Develiden_Erciyes.jpg',
  'p-sertavul':
    'https://upload.wikimedia.org/wikipedia/commons/b/bb/Sertavul_Resmi.jpg',
  'pl-amik':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Amik_Ovas%C4%B1%27n%C4%B1n_Amanoslar%27dan_g%C3%B6r%C3%BCn%C3%BCm%C3%BC.jpg/960px-Amik_Ovas%C4%B1%27n%C4%B1n_Amanoslar%27dan_g%C3%B6r%C3%BCn%C3%BCm%C3%BC.jpg',
  'pl-civril':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/%C3%87ivril_ovas%C4%B1_ve_I%C5%9F%C4%B1kl%C4%B1_G%C3%B6l%C3%BC2.jpg/960px-%C3%87ivril_ovas%C4%B1_ve_I%C5%9F%C4%B1kl%C4%B1_G%C3%B6l%C3%BC2.jpg',
  'pl-duzce':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/D%C3%BCzce.JPG/960px-D%C3%BCzce.JPG',
  'pl-erbaa':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Erbaa_-_G%C3%B6kalan.jpg/960px-Erbaa_-_G%C3%B6kalan.jpg',
  'pl-gembos':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Gembos_ovas%C4%B1nda_ke%C3%A7i_s%C3%BCr%C3%BCs%C3%BC_-_panoramio.jpg/960px-Gembos_ovas%C4%B1nda_ke%C3%A7i_s%C3%BCr%C3%BCs%C3%BC_-_panoramio.jpg',
  'pl-harran':
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Harran-beehouses.jpg',
  'pl-igdir':
    'https://upload.wikimedia.org/wikipedia/commons/6/61/I%C4%9Fd%C4%B1r_Ovas%C4%B1.jpg',
  'pl-malatya':
    'https://upload.wikimedia.org/wikipedia/commons/b/bd/Malatya_ovas%C4%B1_u%C3%A7ak.jpg',
  'pl-niksar':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Niksar_Ovas%C4%B1_-_panoramio.jpg/960px-Niksar_Ovas%C4%B1_-_panoramio.jpg',
  'r-coruh':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/%C3%87oruh_River%2C_Turkey.jpg/960px-%C3%87oruh_River%2C_Turkey.jpg',
  'r-kizilirmak':
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/K%C4%B1z%C4%B1l%C4%B1rmak_River.jpg/960px-K%C4%B1z%C4%B1l%C4%B1rmak_River.jpg',
};

const INK = '#2a2412';
const INK_SOFT = '#4a3c1e';
const PAPER = '#efe3c6';
const PAPER_DEEP = '#ddc79b';
const WATER = '#7fa8b8';
const WATER_DEEP = '#5c8595';

/** Wraps an SVG body in the shared plate frame. */
function plate(body: string, opts = { bg: PAPER }): string {
  const { bg } = opts;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="800" height="450">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${bg}"/>
          <stop offset="1" stop-color="${PAPER_DEEP}"/>
        </linearGradient>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="${INK}" stroke-opacity="0.14" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="400" height="225" fill="url(#sky)"/>
      ${body}
      <rect width="400" height="225" fill="url(#hatch)"/>
      <rect x="3" y="3" width="394" height="219" fill="none" stroke="${INK}" stroke-opacity="0.35"/>
      <rect x="7" y="7" width="386" height="211" fill="none" stroke="${INK}" stroke-opacity="0.18"/>
    </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' '));
}

function mountains() {
  return plate(`
    <path d="M0 168 L52 108 L86 134 L128 76 L170 126 L206 96 L248 140 L286 104 L330 146 L372 116 L400 148 L400 225 L0 225 Z"
          fill="${INK}" fill-opacity="0.30"/>
    <path d="M0 186 L44 150 L82 172 L124 132 L166 168 L208 142 L252 176 L292 148 L336 180 L378 152 L400 174 L400 225 L0 225 Z"
          fill="${INK}" fill-opacity="0.55"/>
    <path d="M128 76 L140 92 L120 92 Z" fill="${PAPER}" fill-opacity="0.85"/>
    <path d="M286 104 L297 118 L277 118 Z" fill="${PAPER}" fill-opacity="0.7"/>
    <path d="M196 120 q10 -8 20 0 q10 8 20 0" stroke="${INK_SOFT}" stroke-opacity="0.4" fill="none" stroke-width="1.2"/>
  `);
}

function river() {
  return plate(`
    <path d="M0 150 C60 140 96 168 140 158 C190 146 214 118 262 126 C310 134 344 164 400 152 L400 225 L0 225 Z"
          fill="${INK}" fill-opacity="0.2"/>
    <path d="M-10 172 C50 150 92 186 140 172 C196 156 220 130 268 140 C318 150 350 182 410 168"
          stroke="${WATER_DEEP}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M-10 172 C50 150 92 186 140 172 C196 156 220 130 268 140 C318 150 350 182 410 168"
          stroke="${WATER}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M60 196 q8 -5 16 0 M150 200 q8 -5 16 0 M250 196 q8 -5 16 0 M330 200 q8 -5 16 0"
          stroke="${INK_SOFT}" stroke-opacity="0.45" fill="none" stroke-width="1.4"/>
  `);
}

function lake() {
  return plate(`
    <ellipse cx="200" cy="150" rx="150" ry="52" fill="${WATER_DEEP}" fill-opacity="0.55"/>
    <ellipse cx="200" cy="148" rx="140" ry="44" fill="${WATER}" fill-opacity="0.75"/>
    <path d="M70 132 q22 -10 44 0 M150 122 q24 -10 48 0 M250 130 q22 -10 44 0"
          stroke="${PAPER}" stroke-opacity="0.55" fill="none" stroke-width="1.6"/>
    <path d="M0 186 L60 176 L120 188 L190 178 L260 190 L330 180 L400 190 L400 225 L0 225 Z"
          fill="${INK}" fill-opacity="0.35"/>
  `);
}

function plain() {
  return plate(`
    <path d="M0 128 L400 120 L400 225 L0 225 Z" fill="${INK}" fill-opacity="0.18"/>
    ${Array.from({ length: 7 }, (_, i) => {
      const y = 136 + i * 12;
      return `<path d="M${20 + (i % 2) * 30} ${y} L${360 - (i % 2) * 20} ${y - 3}" stroke="${INK}" stroke-opacity="0.22" stroke-width="1"`;
    }).join('')}
    <path d="M40 150 l14 -22 l14 22 M70 154 l14 -22 l14 22 M300 148 l14 -22 l14 22"
          stroke="${INK_SOFT}" stroke-opacity="0.5" fill="none" stroke-width="1.4"/>
  `);
}

function plateau() {
  return plate(`
    <path d="M0 190 L70 190 L86 128 L250 122 L268 190 L400 190 L400 225 L0 225 Z"
          fill="${INK}" fill-opacity="0.42"/>
    <path d="M86 128 L250 122" stroke="${INK}" stroke-opacity="0.6" stroke-width="2"/>
    <path d="M70 190 L70 225 M268 190 L268 225" stroke="${INK}" stroke-opacity="0.35" stroke-width="1.2"/>
  `);
}

function cave() {
  return plate(`
    <path d="M40 225 L40 110 Q200 6 360 110 L360 225 Z" fill="${INK}" fill-opacity="0.55"/>
    <path d="M110 225 L110 150 Q200 84 290 150 L290 225 Z" fill="${PAPER}" fill-opacity="0.5"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const x = 122 + i * 30;
      const h = 22 + (i % 3) * 12;
      return `<path d="M${x} 150 L${x + 5} ${150 + h} L${x + 10} 150 Z" fill="${INK_SOFT}" fill-opacity="0.5"/>`;
    }).join('')}
    ${Array.from({ length: 5 }, (_, i) => {
      const x = 130 + i * 34;
      const h = 18 + (i % 2) * 14;
      return `<path d="M${x} 225 L${x + 5} ${225 - h} L${x + 10} 225 Z" fill="${INK_SOFT}" fill-opacity="0.45"/>`;
    }).join('')}
  `);
}

function ancientCity() {
  return plate(`
    <path d="M0 190 L400 184 L400 225 L0 225 Z" fill="${INK}" fill-opacity="0.3"/>
    ${Array.from({ length: 5 }, (_, i) => {
      const x = 90 + i * 52;
      return `<rect x="${x}" y="108" width="16" height="76" fill="${INK}" fill-opacity="0.62"/>
              <rect x="${x - 5}" y="100" width="26" height="9" fill="${INK}" fill-opacity="0.72"/>
              <rect x="${x - 5}" y="184" width="26" height="8" fill="${INK}" fill-opacity="0.72"/>`;
    }).join('')}
    <path d="M60 108 L340 98" stroke="${INK}" stroke-opacity="0.45" stroke-width="3"/>
  `);
}

function borderGate() {
  return plate(`
    <rect x="120" y="96" width="14" height="94" fill="${INK}" fill-opacity="0.7"/>
    <rect x="266" y="96" width="14" height="94" fill="${INK}" fill-opacity="0.7"/>
    <rect x="120" y="90" width="160" height="10" fill="${INK}" fill-opacity="0.75"/>
    <rect x="150" y="126" width="100" height="8" fill="${INK}" fill-opacity="0.45"/>
    <path d="M200 134 L200 178" stroke="${INK}" stroke-opacity="0.5" stroke-width="3" stroke-dasharray="10 7"/>
    <path d="M0 190 L400 190" stroke="${INK}" stroke-opacity="0.3" stroke-width="2"/>
  `);
}

function pass() {
  return plate(`
    <path d="M0 225 L0 120 L70 158 L140 108 L200 186 L260 118 L330 160 L400 128 L400 225 Z"
          fill="${INK}" fill-opacity="0.5"/>
    <path d="M170 225 L200 186 L230 225 Z" fill="${PAPER}" fill-opacity="0.4"/>
    <path d="M200 186 L200 225" stroke="${INK}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="6 6"/>
  `);
}

function mine() {
  return plate(`
    ${Array.from({ length: 5 }, (_, i) => {
      const y = 120 + i * 20;
      return `<path d="M0 ${y} L400 ${y + 6}" stroke="${INK}" stroke-opacity="${0.16 + i * 0.05}" stroke-width="${3 + i}"/>`;
    }).join('')}
    <path d="M150 92 L250 148" stroke="${INK_SOFT}" stroke-width="6" stroke-linecap="round"/>
    <path d="M132 84 q42 -20 84 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `);
}

function karstic() {
  return plate(`
    <path d="M0 148 L120 132 L200 156 L280 128 L400 146 L400 225 L0 225 Z"
          fill="${INK}" fill-opacity="0.35"/>
    <ellipse cx="200" cy="164" rx="58" ry="26" fill="${INK}" fill-opacity="0.55"/>
    <ellipse cx="200" cy="160" rx="44" ry="18" fill="${PAPER}" fill-opacity="0.35"/>
    <path d="M120 132 L120 168 M280 128 L280 164" stroke="${INK}" stroke-opacity="0.4" stroke-width="2"/>
  `);
}

function coastal() {
  return plate(`
    <path d="M0 225 L0 96 L96 96 L128 152 L108 225 Z" fill="${INK}" fill-opacity="0.5"/>
    <path d="M96 96 L128 152 L108 225" stroke="${INK}" stroke-opacity="0.55" stroke-width="2" fill="none"/>
    <rect x="140" y="150" width="260" height="75" fill="${WATER_DEEP}" fill-opacity="0.6"/>
    <path d="M150 166 q22 -8 44 0 t44 0 t44 0 t44 0 M150 184 q22 -8 44 0 t44 0 t44 0 t44 0 M150 202 q22 -8 44 0 t44 0 t44 0 t44 0"
          stroke="${PAPER}" stroke-opacity="0.5" fill="none" stroke-width="1.6"/>
  `);
}

const BY_TYPE: Record<string, () => string> = {
  mountain: mountains,
  river: river,
  lake: lake,
  plain: plain,
  plateau: plateau,
  cave: cave,
  ancient_city: ancientCity,
  border_gate: borderGate,
  pass: pass,
  mine: mine,
  karstic: karstic,
  coastal: coastal,
};

export function illustratedPlate(type?: string): string {
  const fn = BY_TYPE[type || ''] || mountains;
  return fn();
}
