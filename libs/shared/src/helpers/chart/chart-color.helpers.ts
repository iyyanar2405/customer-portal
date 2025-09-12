export const DEFAULT_COLOR_PALETTE: string[] = [
  '#4B9CD5',
  '#1B338C',
  '#A7D4EE',
  '#579A42',
  '#AAFCBA',
  '#3A5F71',
  '#EFE6D6',
  '#5BBEBA',
  '#FBF486',
  '#A4A9E2',
  '#D7423B',
  '#CCCBC9',
  '#A96C20',
  '#968F87',
];

export const UNMAPPED_COLOR = '#000000';

const hexToRgba = (hex: string, opacity: number): string => {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity})`;
};

export const getPaletteColorOrFallback = (
  index: number,
  colorPalette?: string[],
): string => {
  const colors = colorPalette || DEFAULT_COLOR_PALETTE;

  if (index < 0) {
    return UNMAPPED_COLOR;
  }

  if (index >= colors.length) {
    const baseColor = colors[index % colors.length];

    return hexToRgba(baseColor, 0.4);
  }

  return colors[index];
};

export const buildStatusColorPalette = (
  statuses: string[],
  statusColors: Record<string, string>,
): string[] => {
  let fallbackIndex = 0;

  return statuses.map((status) => {
    const mappedColor = statusColors[status];
    if (mappedColor) return mappedColor;

    const paletteLength = DEFAULT_COLOR_PALETTE.length;

    if (fallbackIndex < paletteLength) {
      const fallbackColor = DEFAULT_COLOR_PALETTE[fallbackIndex];
      fallbackIndex += 1;

      return fallbackColor;
    }
    const baseColor = DEFAULT_COLOR_PALETTE[fallbackIndex % paletteLength];

    return hexToRgba(baseColor, 0.4);
  });
};
