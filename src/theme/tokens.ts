export const colors = { cream: '#FAF8F3', white: '#FFFFFF', ink: '#2A2520', muted: '#71685D', border: '#DDD5C7', green: '#4A7A5A', greenDark: '#2F5438', greenTint: '#EBF3EE', coral: '#D96B4F', coralTint: '#FAE8E3', brown: '#8B6B3D', brownTint: '#F5EFE4', yellow: '#F4C95D', highContrastBg: '#10130F', highContrastText: '#FFFFFF' } as const;
export const spacing = { xs: 6, sm: 10, md: 16, lg: 20, xl: 28, xxl: 36 } as const;
export const radii = { sm: 10, md: 16, lg: 22, pill: 999 } as const;
export const typography = { body: 16, bodyLarge: 18, title: 30, heading: 24, subheading: 20, label: 14 } as const;
export type ThemeMode = 'default' | 'large' | 'highContrast';
export const themeFor = (mode: ThemeMode = 'default') => mode === 'highContrast' ? { colors: { ...colors, cream: colors.highContrastBg, white: '#1C221A', ink: colors.highContrastText, muted: '#E5F4E8', border: '#FFFFFF', green: '#9BE5AB', greenDark: '#C7FFD0', greenTint: '#163B22', coral: '#FFAB97', coralTint: '#4A2118', brown: '#DCC08E', brownTint: '#3D3020' }, scale: 1 } : { colors, scale: mode === 'large' ? 1.25 : 1 };
export type Theme = ReturnType<typeof themeFor>;
export const defaultTheme = themeFor();
export const shadow = { shadowColor: '#2A2520', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 } as const;

export const GAME_KEYS = ['memory-match', 'object-recall', 'pattern-sequence'] as const;
export type GameKey = typeof GAME_KEYS[number];
export const gameLabels: Record<GameKey, { title: string; subtitle: string; icon: string; color: string }> = {
  'memory-match': { title: 'Memory Match', subtitle: 'Find familiar pairs', icon: '🪷', color: colors.green },
  'object-recall': { title: 'Object Recall', subtitle: 'Notice and remember', icon: '🧺', color: colors.brown },
  'pattern-sequence': { title: 'Pattern Sequence', subtitle: 'What comes next?', icon: '🌿', color: colors.coral },
};

export const styles = { screen: { flex: 1, backgroundColor: colors.cream }, content: { padding: spacing.lg, gap: spacing.md } } as const;
