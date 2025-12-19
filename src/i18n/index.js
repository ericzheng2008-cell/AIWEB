import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'
import esES from './locales/es-ES.json'
import deDE from './locales/de-DE.json'
import jaJP from './locales/ja-JP.json'
import ptBR from './locales/pt-BR.json'
import frFR from './locales/fr-FR.json'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'es-ES': esES,  // 西班牙语
  'de-DE': deDE,  // 德语
  'ja-JP': jaJP,  // 日语
  'pt-BR': ptBR,  // 葡萄牙语
  'fr-FR': frFR   // 法语
}

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' }
]

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'zh-CN',
  fallbackLocale: 'en-US',
  messages
})

export default i18n
