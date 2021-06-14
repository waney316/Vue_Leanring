import Layout from "@/layout";
export default [
  //Agent管理
  {
    path: "/agent",
    component: Layout,
    name: "Example",
    meta: {
      title: "Agent管理",
      icon: "el-icon-cherry"
    },
    children: [
      {
        path: "env",
        name: "PromInfo",
        // component: () => import('@/views/prom/promInfo'),
        meta: {
          title: "群组管理",
          icon: "el-icon-s-marketing"
        }
      },
      {
        path: "resource",
        name: "PromInfo",
        // component: () => import('@/views/prom/promInfo'),
        meta: {
          title: "资源管理",
          icon: "el-icon-s-marketing"
        }
      },
      {
        path: "template",
        name: "PromInfo",
        // component: () => import('@/views/prom/promInfo'),
        meta: {
          title: "模版配置",
          icon: "el-icon-s-marketing"
        },
        children: [
          {
            path: "paramsTemplate",
            name: "paramsTemplate",
            // component: () => import('@/views/prom/promInfo'),
            meta: {
              title: "参数模版",
              icon: "el-icon-s-marketing"
            }
          },
          {
            path: "appTmeplate",
            name: "appTmeplate",
            // component: () => import('@/views/prom/promInfo'),
            meta: {
              title: "应用资源模版",
              icon: "el-icon-s-marketing"
            }
          }
        ]
      },
      {
        path: "auto_deploy",
        name: "PromInfo",
        // component: () => import('@/views/prom/promInfo'),
        meta: {
          title: "自动化部署",
          icon: "el-icon-s-marketing"
        }
      }
    ]
  }
];
