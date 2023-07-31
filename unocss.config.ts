import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// @unocss-include

export default defineConfig({
  rules: [
    [/^view-transition-([\w-]+)$/, ([, name]) => ({ 'view-transition-name': name })],
  ],
  theme: {
    colors: {
      'primary': {
        50: '#f0faf5',
        100: '#d9f5e9',
        200: '#a8e6c9',
        300: '#69d1a5',
        400: '#3eb37f',
        500: '#41b883',
        600: '#2daa6d',
        700: '#1d8e54',
        800: '#0f713c',
        900: '#08512b',
        950: '#012a16',
      },
      'muted': {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd1e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
      'bg-semi-75': 'rgba(0, 0, 0, 0.75)',
      'dark-1': 'rgb(14,22,33,255)',
      'dark-2': 'rgba(22,33,46)',
      'dark-3': 'rgba(24,37,51,255)',
    },

  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
