import Layout from '@/layout'
export default [
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

]