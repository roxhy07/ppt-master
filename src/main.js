import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Global styles
import './assets/styles/main.css'

/**
 * Initialize and mount the Vue application
 * PPT Master - AI-powered presentation generator
 *
 * Note: forked from hugohe3/ppt-master for personal learning/experimentation
 */
const app = createApp(App)

// State management
const pinia = createPinia()
app.use(pinia)

// Client-side routing
app.use(router)

// Mount to DOM
app.mount('#app')

// helpful for debugging during development
if (import.meta.env.DEV) {
  console.log('[ppt-master] app mounted in dev mode')
}
