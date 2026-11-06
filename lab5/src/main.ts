import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style.css'
import { registerSW } from 'virtual:pwa-register'

// Регистрация Service Worker для PWA и кеширования
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.info('[PWA]: Доступно обновление приложения')
  },
  onOfflineReady() {
    console.info('[PWA]: Service Worker зарегистрирован. Приложение готово к автономной работе без интернета!')
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')

