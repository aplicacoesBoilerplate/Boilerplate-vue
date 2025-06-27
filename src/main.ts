import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './services/axios'
import telefoneMask from './directives/telefoneMask'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.directive('telefone-mask', telefoneMask)
app.mount('#app')
