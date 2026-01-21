/**
 * Color palette for the application
 */

export const colors = {
  // Primary colors
  primary: {
    main: '#FF6B35',
    light: '#FF8C5A',
    dark: '#E55A2B',
  },
  
  // Secondary colors
  secondary: {
    main: '#4A7C59',
    light: '#6B9B7A',
    dark: '#3A5F47',
  },
  
  // Text colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#F9FAFB',
    dark: '#1F2937',
  },
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Rating colors
  rating: '#FFB800',
  
  // Border colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Legacy support (from constants/colors.ts)
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
  },
} as const;

export type Colors = typeof colors;

