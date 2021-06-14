import Layout from "@/layout";

export default [
  //proemtheus管理
  {
    path: "/prom",
    component: Layout,
    name: "Example",
    meta: {
      title: "Prom管理",
      icon: "el-icon-message-solid"
    },
    children: [
      {
        path: "prometheus",
        name: "PromInfo",
        component: () => import("@/views/prom/prominfo"),
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
          icon: "el-icon-s-promotion"
        }
      },
      {
        path: "data",
        name: "Promdata",
        component: () => import("@/views/prom/data"),
        meta: {
          title: "PromQL查询",
          icon: "el-icon-s-promotion"
        }
      },
      {
        path: "alert",
        name: "PromInfo",
        component: () => import("@/views/prom/alert"),
        meta: {
          title: "Alert查询",
          icon: "el-icon-s-promotion"
        }
      }
    ]
  }
];
