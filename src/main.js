import './utils/extensions'
import './index.css'
import { createApp } from 'vue'
import AllComponents from './components/all-components'
import App from './App.vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const app = createApp(App)

app.use(AllComponents)

app.mount('#app')
