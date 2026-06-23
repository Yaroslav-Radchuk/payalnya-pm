import { createI18n } from 'vue-i18n'
import uk from './locales/uk'
import en from './locales/en'

export type Locale = 'uk' | 'en'
const LANG_KEY = 'slash_lang'

const saved = localStorage.getItem(LANG_KEY) as Locale | null

export const i18n = createI18n({
  legacy: false,
  locale: saved ?? 'uk',
  fallbackLocale: 'uk',
  messages: { uk, en },
})

export function setLocale(lang: Locale): void {
  ;(i18n.global.locale as { value: Locale }).value = lang
  localStorage.setItem(LANG_KEY, lang)
  document.documentElement.lang = lang
}
