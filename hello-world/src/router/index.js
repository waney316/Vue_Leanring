import Vue from 'vue'
import VueRouter from 'vue-router'
import day02 from './day02'

import route from './router'
// import day02 from './day02'

Vue.use(VueRouter)

const routes = [
  ...route,
  ...day02
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
