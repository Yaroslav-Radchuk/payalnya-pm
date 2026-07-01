import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

inject()

createApp(App).use(createPinia()).use(router).use(i18n).mount('#app')
