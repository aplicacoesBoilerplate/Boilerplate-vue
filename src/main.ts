import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createRulesPlugin } from 'vuetify/labs/rules'
import './services/axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(createRulesPlugin({}, vuetify.locale))
app.mount('#app')
