import './styles/vuetify-layers.scss';
import './assets/global.scss';
import '@fontsource/roboto/latin-300.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';

import { createApp } from 'vue';

import { registerPlugins } from '@/plugins';

import App from './App.vue';

const app = createApp(App);
registerPlugins(app);

app.mount('#app');
