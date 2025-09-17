// Configurable color theme system
export const colorTheme = {
  primary: '#87A96B',      // Sage Green - main brand color
  secondary: '#D2691E',    // Terracotta - accent color
  accent: '#4A90B8',       // Soft Blue - highlights
  primaryBg: '#FAF7F0',    // Cream - main background
  secondaryBg: '#FFFFFF',  // White - card backgrounds

  // Additional semantic colors
  border: '#E5E7EB',
  muted: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
} as const

export type ColorTheme = typeof colorTheme