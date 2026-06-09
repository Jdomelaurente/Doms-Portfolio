import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import { firebaseApp } from './firebase'
import './assets/css/style.css'

const app = createApp(App)
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will also add the auth module, typically for the admin panel or contact form
    VueFireAuth(),
  ],
})

app.mount('#app')
