import Home from '../views/Home.vue'
export default [
  {
    path: '/',
    name: 'Home',
    component: Home
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
  }

]
