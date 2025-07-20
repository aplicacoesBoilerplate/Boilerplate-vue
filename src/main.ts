import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './services/axios'
import telefoneMask from './directives/telefoneMask'
import numericMask from './directives/numericMask'
import dataMask from './directives/dataMask'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.directive('telefone-mask', telefoneMask)
app.directive('numeric-mask', numericMask)
app.directive('data-mask', dataMask)
app.mount('#app')
