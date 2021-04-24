import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// // 导航前置守卫
// var IsLogin = false

// router.beforeEach((to, from, next) => {
//   // to：要跳转的地址
//   // from：源地址
//   // next: 回调函数
//   if (to.meta.auth && !IsLogin) {
//     console.log('已经登录')
//     // token 验证
//   } else {
//     next(new Error('未登录'))
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
