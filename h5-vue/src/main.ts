

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@nutui/nutui/dist/packages/toast/style/css';
import '@nutui/nutui/dist/packages/notify/style/css';
import '@nutui/nutui/dist/packages/dialog/style/css';
import '@nutui/nutui/dist/packages/imagepreview/style/css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
