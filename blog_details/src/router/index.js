import Vue from 'vue'
import VueRouter from 'vue-router'
import Details from '../views/details.vue'
// 引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueRouter)
// 引入elementui
Vue.use(ElementUI)

const routes = [
  // 添加blog_datails 视图
  {
    path: '/blog_datails',
    name: 'Details',
    component: Details
    // component: () => import('../views/details.vue')
  },
  // 添加blog_index 视图
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
