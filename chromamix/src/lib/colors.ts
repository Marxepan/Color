export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

export function mixColors(color1: string, color2: string, weight: number = 0.5): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return "#000000";

  const r = Math.round(c1.r * (1 - weight) + c2.r * weight);
  const g = Math.round(c1.g * (1 - weight) + c2.g * weight);
  const b = Math.round(c1.b * (1 - weight) + c2.b * weight);

  return rgbToHex(r, g, b);
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function generateSteps(color1: string, color2: string, steps: number): string[] {
  const palette = [];
  for (let i = 0; i < steps; i++) {
    const weight = i / (steps - 1);
    palette.push(mixColors(color1, color2, weight));
  }
  return palette;
}
