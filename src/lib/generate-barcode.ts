// Code 39 generator (Canvas) — returns a dataURL
// Allowed chars: 0-9, A-Z, space, -, ., $, /, +, %
// Example: const url = generateBarcode("STU-2025-001");

type Code39Options = {
  height?: number;           // bar height in px (not counting text)
  module?: number;           // narrow bar width (X-dimension)
  ratio?: number;            // wide:narrow ratio (typical 3:1)
  margin?: number;           // quiet zone in modules (typical 10)
  drawText?: boolean;        // draw human-readable text
  includeChecksum?: boolean; // include Mod-43 checksum
  background?: string;       // e.g. "#fff"
  barColor?: string;         // e.g. "#000"
  font?: string;             // e.g. "12px monospace"
};

export function generateBarcode(value: string, opts: Code39Options = {}): string {
  const {
    height = 60,
    module = 2,
    ratio = 3,
    margin = 10,
    drawText = true,
    includeChecksum = false,
    background = "#fff",
    barColor = "#000",
    font = "12px monospace",
  } = opts;

  const ALLOWED = /^[0-9A-Z\-\.\ \$\/\+\%]*$/;
  const input = value?.toUpperCase().trim();
  if (!ALLOWED.test(input)) {
    throw new Error("Code39 supports 0-9, A-Z, space, -, ., $, /, +, %");
  }

  // Code 39 patterns: 'N'/'W' for bars (black), 'n'/'w' for spaces (white)
  // Source pattern table aligns with Code 39 spec.
  const P: Record<string, string> = {
    "0":"NnNwWnWnN","1":"WnNwNnNnW","2":"NnWwNnNnW","3":"WnWwNnNnN",
    "4":"NnNwWnNnW","5":"WnNwWnNnN","6":"NnWwWnNnN","7":"NnNwNnWnW",
    "8":"WnNwNnWnN","9":"NnWwNnWnN","A":"WnNnNwNnW","B":"NnWnNwNnW",
    "C":"WnWnNwNnN","D":"NnNnWwNnW","E":"WnNnWwNnN","F":"NnWnWwNnN",
    "G":"NnNnNwWnW","H":"WnNnNwWnN","I":"NnWnNwWnN","J":"NnNnWwWnN",
    "K":"WnNnNnNwW","L":"NnWnNnNwW","M":"WnWnNnNwN","N":"NnNnWnNwW",
    "O":"WnNnWnNwN","P":"NnWnWnNwN","Q":"NnNnNnWwW","R":"WnNnNnWwN",
    "S":"NnWnNnWwN","T":"NnNnWnWwN","U":"WwNnNnNnW","V":"NwWnNnNnW",
    "W":"WwWnNnNnN","X":"NwNnWnNnW","Y":"WwNnWnNnN","Z":"NwWnWnNnN",
    "-":"NwNnNnWnW",".":"WwNnNnWnN"," ":"NwWnNnWnN","$":"NwNwNwNnN",
    "/":"NwNwNnNwN","+":"NwNnNwNwN","%":"NnNwNwNwN","*":"NwNnWnWnN"
  };

  // Mod-43 checksum (optional)
  const CHECK_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%";
  const valueForChecksum = includeChecksum ? input : input; // compute, then append
  const checksumVal = [...valueForChecksum].reduce((sum, ch) => sum + CHECK_CHARS.indexOf(ch), 0) % 43;
  const checksumChar = CHECK_CHARS[checksumVal];

  const data = includeChecksum ? input + checksumChar : input;
  const encoded = `*${data}*`; // start/stop

  const narrow = module;
  const wide = ratio * module;
  const quiet = margin * module;

  // Measure width (sum of element widths + inter-character gaps + quiet zones)
  const patterns = [...encoded].map(ch => {
    const pat = P[ch];
    if (!pat) throw new Error(`Unsupported character in Code39: ${ch}`);
    return pat;
  });

  const interGap = narrow; // one narrow space between characters
  let total = 0;
  for (let i = 0; i < patterns.length; i++) {
    const pat = patterns[i];
    for (const el of pat) total += (el === 'W' || el === 'w') ? wide : narrow;
    if (i < patterns.length - 1) total += interGap;
  }
  const textPadding = drawText ? 16 : 0;

  const canvas = document.createElement("canvas");
  canvas.width = quiet + total + quiet;
  canvas.height = height + textPadding;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.toDataURL();

  // Background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw bars
  ctx.fillStyle = barColor;
  let x = quiet;
  for (let i = 0; i < patterns.length; i++) {
    const pat = patterns[i];
    for (const el of pat) {
      const w = (el === 'W' || el === 'w') ? wide : narrow;
      const isBar = (el === 'N' || el === 'W');
      if (isBar) ctx.fillRect(x, 0, w, height);
      x += w;
    }
    if (i < patterns.length - 1) x += interGap; // inter-character gap
  }

  // Human-readable text
  if (drawText) {
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = barColor;
    ctx.fillText(data, canvas.width / 2, height + 2);
  }

  return canvas.toDataURL("image/png");
}
