import { StyleSheet } from 'react-native';
import colors from './color';

// Profile-specific styling constants
export const PROFILE_STYLES = {
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  
  // Border Radius
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
  
  // Typography
  typography: {
    heading: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.darkGray,
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.darkGray,
    },
    body: {
      fontSize: 15,
      fontWeight: '400',
      color: colors.darkGray,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
      color: colors.coolGray,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.darkGray,
    },
  },
  
  // Shadows
  shadows: {
    card: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    button: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
  },
  
  // Colors
  profileColors: {
    primary: colors.primary,
    secondary: '#f0fdf4',
    background: '#f9fafb',
    card: colors.white,
    border: colors.gray200,
    text: colors.darkGray,
    textSecondary: colors.coolGray,
    textPlaceholder: colors.lightGray,
    success: colors.emerald,
    error: colors.red,
    warning: colors.orange,
  },
};

// Common profile component styles
export const profileComponentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PROFILE_STYLES.profileColors.background,
  },
  
  content: {
    padding: PROFILE_STYLES.spacing.lg,
  },
  
  card: {
    backgroundColor: PROFILE_STYLES.profileColors.card,
    borderRadius: PROFILE_STYLES.borderRadius.lg,
    borderWidth: 1,
    borderColor: PROFILE_STYLES.profileColors.border,
    marginBottom: PROFILE_STYLES.spacing.lg,
    ...PROFILE_STYLES.shadows.card,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: PROFILE_STYLES.spacing.xl,
    paddingBottom: PROFILE_STYLES.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  sectionTitle: {
    ...PROFILE_STYLES.typography.subheading,
    marginBottom: PROFILE_STYLES.spacing.xs,
  },
  
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: '#6b7280',
    lineHeight: 18,
  },
  
  sectionContent: {
    padding: PROFILE_STYLES.spacing.xl,
    paddingTop: PROFILE_STYLES.spacing.lg,
  },
  
  buttonPrimary: {
    backgroundColor: PROFILE_STYLES.profileColors.primary,
    paddingVertical: PROFILE_STYLES.spacing.md,
    paddingHorizontal: PROFILE_STYLES.spacing.lg,
    borderRadius: PROFILE_STYLES.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: PROFILE_STYLES.spacing.sm,
    ...PROFILE_STYLES.shadows.button,
  },
  
  buttonSecondary: {
    backgroundColor: PROFILE_STYLES.profileColors.secondary,
    paddingVertical: PROFILE_STYLES.spacing.md,
    paddingHorizontal: PROFILE_STYLES.spacing.lg,
    borderRadius: PROFILE_STYLES.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: PROFILE_STYLES.spacing.sm,
    borderWidth: 1,
    borderColor: PROFILE_STYLES.profileColors.primary,
  },
  
  buttonTextPrimary: {
    ...PROFILE_STYLES.typography.label,
    color: colors.white,
    fontWeight: '600',
  },
  
  buttonTextSecondary: {
    ...PROFILE_STYLES.typography.label,
    color: PROFILE_STYLES.profileColors.primary,
    fontWeight: '600',
  },
  
  inputContainer: {
    marginBottom: PROFILE_STYLES.spacing.lg,
  },
  
  inputLabel: {
    ...PROFILE_STYLES.typography.label,
    marginBottom: PROFILE_STYLES.spacing.sm,
  },
  
  input: {
    ...PROFILE_STYLES.typography.body,
    borderWidth: 1,
    borderColor: PROFILE_STYLES.profileColors.border,
    borderRadius: PROFILE_STYLES.borderRadius.md,
    padding: PROFILE_STYLES.spacing.md,
    backgroundColor: PROFILE_STYLES.profileColors.card,
  },
  
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6b7280',
  },
});

export default PROFILE_STYLES;