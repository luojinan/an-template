import { createApp } from 'vue'
import { initializeDarkMode } from '@/utils/dark-mode'
import App from './App.vue'
import router from './router'
import { store } from './store'
// 使用自动import无法引入函数式组件，全量引入样式
// 尝试移除自动引入，发现vant import语句的组件名和模板组件名不一致，缺少前缀且无法自定义🤮
import 'vant/lib/index.css'
// normalize.css
import 'normalize.css/normalize.css'
// 全局样式
import './styles/main.css'
// svg icon
import 'virtual:svg-icons-register'

initializeDarkMode()

const app = createApp(App)
app.use(store)
app.use(router)

app.mount('#app')
