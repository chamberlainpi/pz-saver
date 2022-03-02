import './utils/extensions'
import './index.css'
import { createApp } from 'vue'
import AllComponents from './components/all-components'
import App from './App.vue'

const app = createApp(App)

app.use(AllComponents)

app.mount('#app')
