import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

import 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import router from './router'
import patientHeader from './components/patientHeader.vue'
import patientNav from './components/patientNav.vue'
import adminNav from './components/adminNav.vue'
import doctorHeader from './components/doctorHeader.vue'
import doctorNav from './components/doctorNav.vue'

const app = createApp(App);
app.component('patientHeader', patientHeader);
app.component('patientNav', patientNav);
app.component('adminNav', adminNav);
app.component('doctorHeader', doctorHeader);
app.component('doctorNav', doctorNav);


app.use(router).mount('#app')
axios.defaults.baseURL = "http://localhost:8081"
axios.defaults.withCredentials = true

