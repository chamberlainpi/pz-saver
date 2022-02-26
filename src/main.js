import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import './utils/extensions'
import AllComponents from './components/all-components'
import socket from './socket'

const app = createApp(App)

app.use(AllComponents)

app.mount('#app')
