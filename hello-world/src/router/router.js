import Home from '../views/Home.vue'
export default [
  {
    path: '/',
    name: 'Home',
    component: Home
    // redirect: '/about'
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/hello-world',
    name: 'HelloWorld',
    component: () => import('../views/hello-world.vue')
  },

  {
    path: '/day01/demo2',
    name: 'demo2',
    component: () => import('../views/day01/demo2.vue')
  },
  {
    path: '/day01/demo3',
    name: 'demo3',
    component: () => import('../views/day01/demo3.vue')
  },
  {
    path: '/day01/demo4',
    name: 'demo4',
    component: () => import('../views/day01/demo4.vue')
  },
  {
    path: '/day01/demo5',
    name: 'demo5',
    component: () => import('../views/day01/demo5.vue')
  },
  {
    path: '/day01/demo6',
    name: 'demo6',
    component: () => import('../views/day01/demo6.vue')
  },
  {
    path: '/day01/demo7',
    name: 'demo7',
    component: () => import('../views/day01/demo7.vue')
  },
  {
    path: '/day01/demo8',
    name: 'demo8',
    component: () => import('../views/day01/demo8.vue')
  },
  {
    path: '/day01/demo9',
    name: 'demo9',
    component: () => import('../views/day01/demo9.vue')
  },
  {
    path: '/day01/demo10',
    name: 'demo10',
    component: () => import('../views/day01/demo10.vue')
  },
  {
    path: '/day01/demo11',
    name: 'demo11',
    component: () => import('../views/day01/demo11.vue')
  },
  {
    path: '/day01/demo12',
    name: 'demo12',
    component: () => import('../views/day01/demo12.vue')
  },
  {
    path: '/day01/demo13',
    name: 'demo13',
    component: () => import('../views/day01/demo13.vue')
  },
  {
    path: '/day01/demo14',
    name: 'demo14',
    component: () => import('../views/day01/demo14.vue')
  },
  {
    path: '/test1/:id',
    props: true,
    name: 'test1',
    component: () => import('../views/test/test1.vue')

  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import('../views/test/test2.vue'),
    props: {
      id: 12345
    },
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      console.log(to)
      console.log(from)
      console.log(next)
      if (to.meta.auth) {
        console.log('sucess login')
        // 如果成功登录，跳转至首页
        next('/')
      } else {
        next(new Error('失败'))
      }
    }

  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('../views/test/demo.vue'),
    children: [{
      path: 'user/:id',
      name: 'DemoUser',
      // component: () => import('../views/test/user.vue')  //单个componetn
      components: { // 多个component
        default: () => import('../views/test/user.vue'),
        user2: () => import('../views/test/user2.vue')
      },
      props: {
        default: true,
        user2: true
      }
    }]
  },

  // axios demo
  {
    path: '/axios/demo1',
    name: 'axios-demo1',
    component: () => import('../views/axios/demo1.vue')
  }

]
