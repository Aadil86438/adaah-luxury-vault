import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// ── Light Theme ──────────────────────────────────────────────
const adaahLightTheme = {
  dark: false,
  colors: {
    background:      '#FAF7F2',
    surface:         '#FFFFFF',
    'surface-variant': '#F0EBE1',
    primary:         '#D97A6C',   // primary-hover = CTA color
    secondary:       '#E6A79B',   // primary = softer accent
    error:           '#C0392B',
    info:            '#5B8DB8',
    success:         '#A8B88A',
    warning:         '#D4A042',
    'on-background': '#4A3F35',
    'on-surface':    '#4A3F35',
    'on-primary':    '#FFFFFF',
    'on-secondary':  '#FFFFFF',
  },
}

// ── Dark Theme ───────────────────────────────────────────────
const adaahDarkTheme = {
  dark: true,
  colors: {
    background:      '#1E1E1E',
    surface:         '#2A2A2A',
    'surface-variant': '#252525',
    primary:         '#D97A6C',
    secondary:       '#E6A79B',
    error:           '#CF6679',
    info:            '#5B8DB8',
    success:         '#A8B88A',
    warning:         '#D4A042',
    'on-background': '#F5EDE4',
    'on-surface':    '#F5EDE4',
    'on-primary':    '#FFFFFF',
    'on-secondary':  '#FFFFFF',
  },
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'adaahLightTheme',
    themes: {
      adaahLightTheme,
      adaahDarkTheme,
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none; letter-spacing: 0.04em; font-family: "DM Sans", sans-serif; font-weight: 500;',
    },
    VTextField: {
      color: 'primary',
    },
    VTextarea: {
      color: 'primary',
    },
    VSelect: {
      color: 'primary',
    },
    VFileInput: {
      color: 'primary',
    },
  },
})
