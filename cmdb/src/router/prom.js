import Layout from "@/layout";

export default [
  //proemtheus管理
  {
    path: "/prom",
    component: Layout,
    name: "Example",
    meta: {
      title: "PROM管理",
      icon: "el-icon-message-solid"
    },
    children: [{
        path: "prometheus",
        name: "PromInfo",
        component: () => import("@/views/prom/promInfo"),
        meta: {
          title: "Prom数据源",
          icon: "el-icon-s-promotion"
        }
      },
      {
        path: "alertmanager",
        name: "AlertData",
        component: () => import("@/views/prom/alertinfo"),
        meta: {
          title: "Alert数据源",
          icon: "el-icon-message-solid"
        }
      },
      {
        path: "data",
        name: "Promdata",
        component: () => import("@/views/prom/data"),
        meta: {
          title: "数据导出",
          icon: "el-icon-star-on"
        }
      }
      // {
      //   path: "alert",
      //   name: "PromInfo",
      //   component: () => import("@/views/prom/alert"),
      //   meta: {
      //     title: "Alert查询",
      //     icon: "el-icon-s-goods"
      //   }
      // }
    ]
  }
];
