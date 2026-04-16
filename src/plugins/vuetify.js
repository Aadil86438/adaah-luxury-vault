import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const adaahLightTheme = {
  dark: false,
  colors: {
    background: '#FAF7F2',
    surface: '#FFFFFF',
    primary: '#E6A79B',
    secondary: '#D97A6C',
    error: '#B00020',
    info: '#2196F3',
    success: '#A8B88A',
    warning: '#FB8C00',
    'on-background': '#4A3F35',
    'on-surface': '#4A3F35',
  },
}

const adaahDarkTheme = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#E6A79B',
    secondary: '#D97A6C',
    error: '#CF6679',
    info: '#2196F3',
    success: '#A8B88A',
    warning: '#FB8C00',
    'on-background': '#EDEDED',
    'on-surface': '#EDEDED',
  },
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'adaahLightTheme',
    themes: {
      adaahLightTheme,
      adaahDarkTheme,
    },
  },
})
