import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

/**
 * Nordic Theme - Inspired by Swedish and Norwegian flags
 * 
 * Swedish Blue: #005293 (primary)
 * Swedish Yellow: #FECC00 (accent)
 * Norwegian Blue: #002868 (dark)
 * Norwegian Red: #BA0C2F (error)
 * Finnish Blue: #003580 (secondary)
 * 
 * SAP-style: Clean white background, blue boxes, structured layout
 */

export const nordicColors = {
  // Primary - Swedish Blue
  primary: '#005293',
  primaryLight: '#0066B3',
  primaryDark: '#003D6B',
  
  // Secondary - Norwegian Blue
  secondary: '#002868',
  secondaryLight: '#003D8F',
  secondaryDark: '#001A47',
  
  // Accent - Swedish Yellow
  accent: '#FECC00',
  accentLight: '#FFD633',
  accentDark: '#E5B800',
  
  // Finnish Blue
  finnish: '#003580',
  
  // Error - Norwegian Red
  error: '#BA0C2F',
  errorLight: '#D41A3F',
  errorDark: '#8F0A25',
  
  // Success - Nordic Green
  success: '#00A651',
  successLight: '#00C75F',
  successDark: '#008542',
  
  // Warning
  warning: '#FF9800',
  
  // Neutrals - SAP Style
  white: '#FFFFFF',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceVariant: '#E8EEF4',
  
  // Text
  text: '#1A1A1A',
  textSecondary: '#5A6872',
  textDisabled: '#A0A9B1',
  
  // Borders
  border: '#D4DCE5',
  borderLight: '#E8EEF4',
  
  // Shadows
  shadow: 'rgba(0, 82, 147, 0.1)',
  shadowDark: 'rgba(0, 40, 104, 0.15)',
};

export const nordicTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: nordicColors.primary,
    secondary: nordicColors.secondary,
    accent: nordicColors.accent,
    error: nordicColors.error,
    background: nordicColors.background,
    surface: nordicColors.surface,
    text: nordicColors.text,
    onSurface: nordicColors.text,
    onBackground: nordicColors.text,
    disabled: nordicColors.textDisabled,
    placeholder: nordicColors.textSecondary,
    backdrop: 'rgba(0, 40, 104, 0.5)',
    notification: nordicColors.error,
    
    // Custom colors
    success: nordicColors.success,
    warning: nordicColors.warning,
    border: nordicColors.border,
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const shadows = {
  small: {
    shadowColor: nordicColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: nordicColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: nordicColors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};
