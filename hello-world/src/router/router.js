export const day01Router = [
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
