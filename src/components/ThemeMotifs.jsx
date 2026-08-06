const circlePath = (cx, cy, radius) => [
  `M ${cx - radius} ${cy}`,
  `a ${radius} ${radius} 0 1 0 ${radius * 2} 0`,
  `a ${radius} ${radius} 0 1 0 ${radius * -2} 0`,
].join(" ");

const ellipsePath = (cx, cy, rx, ry) => [
  `M ${cx - rx} ${cy}`,
  `a ${rx} ${ry} 0 1 0 ${rx * 2} 0`,
  `a ${rx} ${ry} 0 1 0 ${rx * -2} 0`,
].join(" ");

export const FIXED_THEME_MOTIFS = Object.freeze({
  gentle: "clover",
  thanks: "heart",
  spring: "sakura",
  summer: "sunflower",
  autumn: "ginkgo",
  winter: "snow",
});

const CUSTOM_MOTIF_ALIASES = Object.freeze({
  flower: "flower",
  heart: "heart",
  bookmark: "bookmark",
  envelope: "envelope",
  clover: "clover",
  snow: "snow",
});

const MOTIF_PATHS = Object.freeze({
  clover: [
    circlePath(36, 35, 17),
    circlePath(64, 35, 17),
    circlePath(36, 61, 17),
    circlePath(64, 61, 17),
    "M 47 56 H 54 L 57 94 H 49 Z",
  ],
  heart: [
    "M 50 88 C 42 78 14 61 14 36 C 14 17 37 10 50 29 C 63 10 86 17 86 36 C 86 61 58 78 50 88 Z",
  ],
  sakura: [
    ellipsePath(50, 24, 13, 21),
    ellipsePath(75, 43, 21, 13),
    ellipsePath(66, 73, 14, 21),
    ellipsePath(34, 73, 14, 21),
    ellipsePath(25, 43, 21, 13),
    circlePath(50, 51, 10),
  ],
  sunflower: [
    ellipsePath(50, 17, 10, 20),
    ellipsePath(50, 83, 10, 20),
    ellipsePath(17, 50, 20, 10),
    ellipsePath(83, 50, 20, 10),
    circlePath(27, 27, 13),
    circlePath(73, 27, 13),
    circlePath(27, 73, 13),
    circlePath(73, 73, 13),
    circlePath(50, 50, 19),
  ],
  ginkgo: [
    "M 50 91 L 47 62 C 31 60 14 52 8 33 C 19 17 34 14 50 35 C 66 14 81 17 92 33 C 86 52 69 60 53 62 L 56 91 Z",
  ],
  snow: [
    "M 46 5 H 54 V 35 L 75 14 L 81 20 L 60 41 H 95 V 49 H 60 L 81 70 L 75 76 L 54 55 V 95 H 46 V 55 L 25 76 L 19 70 L 40 49 H 5 V 41 H 40 L 19 20 L 25 14 L 46 35 Z",
  ],
  flower: [
    circlePath(50, 22, 17),
    circlePath(76, 48, 17),
    circlePath(64, 78, 17),
    circlePath(36, 78, 17),
    circlePath(24, 48, 17),
    circlePath(50, 52, 12),
  ],
  bookmark: ["M 28 8 H 72 V 92 L 50 75 L 28 92 Z"],
  envelope: ["M 8 22 H 92 V 80 H 8 Z M 8 24 L 50 57 L 92 24 V 34 L 50 68 L 8 34 Z"],
});

export function getThemeMotif(theme) {
  if (!theme || theme.decoration === "none") return null;
  return FIXED_THEME_MOTIFS[theme.id]
    || CUSTOM_MOTIF_ALIASES[theme.decoration]
    || null;
}

function MotifSvg({ motif }) {
  const paths = MOTIF_PATHS[motif] || MOTIF_PATHS.clover;
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100">
      {paths.map((path, index) => <path d={path} key={`${motif}-${index}`} />)}
    </svg>
  );
}

export function ThemeMotifLayer({ compact = false, theme }) {
  const motif = getThemeMotif(theme);
  if (!motif) return null;

  return (
    <span className={`theme-motif-layer motif-${motif}${compact ? " compact" : ""}`} aria-hidden="true">
      <span className="theme-motif motif-top-left"><MotifSvg motif={motif} /></span>
      {!compact && <span className="theme-motif motif-bottom-right"><MotifSvg motif={motif} /></span>}
    </span>
  );
}

function drawMotif(context, motif, x, y, size) {
  const paths = MOTIF_PATHS[motif] || MOTIF_PATHS.clover;
  context.save();
  context.translate(x - size / 2, y - size / 2);
  context.scale(size / 100, size / 100);
  paths.forEach((path) => context.fill(new Path2D(path)));
  context.restore();
}

export function drawThemeMotifLayer(context, theme) {
  const motif = getThemeMotif(theme);
  if (!motif) return;

  context.save();
  context.fillStyle = theme.accent;
  context.globalAlpha = 0.32;
  drawMotif(context, motif, 150, 165, 72);
  drawMotif(context, motif, 900, 1095, 72);
  context.restore();
}
