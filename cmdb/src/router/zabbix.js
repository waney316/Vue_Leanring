export default [
      //zabbix管理
  {

    path: '/zabbix',
    component: Layout,
    name: 'Example',
    meta: {
      title: 'Zabbix管理',
      icon: 'el-icon-s-help'
    },
    children: [{
        path: 'info',
        name: 'ZabbixInfo',
        component: () => import('@/views/zabbix/zabbixInfo'),
        meta: {
          title: '数据源',
          icon: 'form'
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
    ]
  },
]