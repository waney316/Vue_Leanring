import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    }]
  },

  //数据分类
  {
    path: '/cmdb',
    component: Layout,
    name: 'Example',
    meta: {
      title: '资产管理',
      icon: 'el-icon-s-help'
    },
    children: [{
        path: 'classify',
        name: 'CmdbClassify',
        component: () => import('@/views/cmdb/classify'),
        meta: {
          title: '数据分类',
          icon: 'form'
        }
      },
      {
        path: "data_dict",
        name: "dataDict",
        meta: {
          title: "数据字典",
          icon: 'form'
        },
        component: () => import('@/views/cmdb/dataDict')
      }
    ]
  },

  //zabbix管理
  {

    path: '/zabbix',
    component: Layout,
    name: 'Example',
    meta: {
      title: 'Zabbix管理',
      icon: 'el-icon-cherry'
    },
    children: [{
        path: 'info',
        name: 'ZabbixInfo',
        component: () => import('@/views/zabbix/zabbixInfo'),
        meta: {
          title: '数据源',
          icon: 'list'
        }
      },
      {
        path: 'template',
        name: 'templteManger',
        component: () => import('@/views/zabbix/template'),
        meta: {
          title: '模板管理',
          icon: 'form'
        }
      },

      {
        path: 'hostgroup',
        name: 'hostgroupManger',
        component: () => import('@/views/zabbix/hostgroup'),
        meta: {
          title: '主机组管理',
          icon: 'nested'
        }
      },
      {
        path: 'host',
        name: 'hostManger',
        component: () => import('@/views/zabbix/host'),
        meta: {
          title: '主机管理',
          icon: 'tree'
        }
      },
      {
        path: 'alert',
        name: 'alertManger',
        component: () => import('@/views/zabbix/alert'),
        meta: {
          title: '告警管理',
          icon: 'message'
        }
      },
      {
        path: 'data',
        name: 'dataSearch',
        component: () => import('@/views/zabbix/data'),
        meta: {
          title: '数据查询',
          icon: 'eye-open'
        }
      },
      {
        path: 'operation',
        name: 'operation',
        component: () => import('@/views/zabbix/operation'),
        meta: {
          title: 'API操作',
          icon: 'eye-open'
        }
      },
    ]
  },

  //proemtheus管理
  {

    path: '/prom',
    component: Layout,
    name: 'Example',
    meta: {
      title: 'Prom管理',
      icon: 'el-icon-message-solid',
    },
    children: [{
        path: 'info',
        name: 'PromInfo',
        component: () => import('@/views/prom/promInfo'),
        meta: {
          title: 'Prom管理',
          icon: 'el-icon-s-promotion'
        }
      },
    ]
  },
  //snmpTrap管理
  {

    path: '/snmptrap',
    component: Layout,
    name: 'Example',
    meta: {
      title: 'Trap管理',
      icon: 'el-icon-s-open'
    },
    children: [{
        path: 'info',
        name: 'PromInfo',
        // component: () => import('@/views/prom/promInfo'),
        meta: {
          title: 'Trap管理',
          icon: 'el-icon-s-open'
        }
      },
    ]
  },
  //Agent管理
  {

    path: '/agent',
    component: Layout,
    name: 'Example',
    meta: {
      title: 'Agent管理',
      icon: 'el-icon-cherry'
    },
    children: [{
        path: 'info',
        name: 'PromInfo',
        // component: () => import('@/views/prom/promInfo'),
        meta: {
          title: 'Agent管理',
          icon: 'el-icon-s-marketing'
        }
      },
    ]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
