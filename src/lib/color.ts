/**
 * Color system utilities aligned with CSS variables defined in `src/index.css`.
 *
 * Usage examples:
 * - style={{ color: colors.foreground }}
 * - const stroke = color("chart1")
 * - const bg = colorMix("primary", 0.12)
 */

export type SemanticColorKey =
  | "background"
  | "foreground"
  | "card"
  | "cardForeground"
  | "popover"
  | "popoverForeground"
  | "primary"
  | "primaryForeground"
  | "secondary"
  | "secondaryForeground"
  | "muted"
  | "mutedForeground"
  | "accent"
  | "accentForeground"
  | "destructive"
  | "border"
  | "input"
  | "ring"
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5"
  | "sidebar"
  | "sidebarForeground"
  | "sidebarPrimary"
  | "sidebarPrimaryForeground"
  | "sidebarAccent"
  | "sidebarAccentForeground"
  | "sidebarBorder"
  | "sidebarRing";

const cssVarByKey: Record<SemanticColorKey, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  border: "--border",
  input: "--input",
  ring: "--ring",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
  sidebar: "--sidebar",
  sidebarForeground: "--sidebar-foreground",
  sidebarPrimary: "--sidebar-primary",
  sidebarPrimaryForeground: "--sidebar-primary-foreground",
  sidebarAccent: "--sidebar-accent",
  sidebarAccentForeground: "--sidebar-accent-foreground",
  sidebarBorder: "--sidebar-border",
  sidebarRing: "--sidebar-ring",
};

/**
 * Returns a CSS var reference string.
 * cssVar('primary') => 'var(--primary)'
 * cssVar('--primary') => 'var(--primary)'
 */
export function cssVar(name: string): string {
  return name.startsWith("--") ? `var(${name})` : `var(--${name})`;
}

/**
 * Map of semantic color keys to their CSS variable reference: 'var(--*)'.
 */
export const colors: Record<SemanticColorKey, string> = Object.fromEntries(
  Object.entries(cssVarByKey).map(([key, cssVarName]) => [key, cssVar(cssVarName)])
) as Record<SemanticColorKey, string>;

/**
 * Convenience getter for a semantic color.
 */
export function color(name: SemanticColorKey): string {
  return colors[name];
}

/**
 * Returns a CSS color-mix string blending the semantic color with transparency.
 * Uses percentage based on opacity [0..1].
 * Example: colorMix('primary', 0.12)
 */
export function colorMix(name: SemanticColorKey, opacity: number): string {
  const clamped = Math.max(0, Math.min(1, opacity));
  const percent = `${(clamped * 100).toFixed(2)}%`;
  return `color-mix(in oklab, ${colors[name]} ${percent}, transparent)`;
}

/**
 * Default chart palette referencing CSS variables. Automatically adapts to dark mode.
 */
export const chartColors: string[] = [
  colors.chart1,
  colors.chart2,
  colors.chart3,
  colors.chart4,
  colors.chart5,
];

/**
 * Semantic aliases for common UI use.
 */
export const semantic = {
  text: colors.foreground,
  subtleText: colors.mutedForeground,
  bg: colors.background,
  cardBg: colors.card,
  cardText: colors.cardForeground,
  primaryBg: colors.primary,
  primaryText: colors.primaryForeground,
  secondaryBg: colors.secondary,
  secondaryText: colors.secondaryForeground,
  accentBg: colors.accent,
  accentText: colors.accentForeground,
  border: colors.border,
  input: colors.input,
  ring: colors.ring,
};

