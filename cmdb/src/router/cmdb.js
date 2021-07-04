import Layout from "@/layout";
export default [
  //数据分类
  {
    path: "/cmdb",
    component: Layout,
    name: "Example",
    meta: {
      title: "资产管理",
      icon: "el-icon-s-help"
    },
    children: [
      // {
      //   path: "classify",
      //   name: "CmdbClassify",
      //   component: () => import("@/views/cmdb/classify"),
      //   meta: {
      //     title: "数据分类",
      //     icon: "form"
      //   }
      // },
      // {
      //   path: "data_dict",
      //   name: "dataDict",
      //   meta: {
      //     title: "数据字典",
      //     icon: "form"
      //   },
      //   component: () => import("@/views/cmdb/dataDict")
      // },
      {
        path: "model",
        name: "model",
        component: () => import("@/views/cmdb/model"),
        meta: {
          title: "服务模型",
          icon: "list"
        },
        children: []
      },
      {
        path: "details",
        name: "modelDetails",
        component: () => import("@/views/cmdb/details"),
        hidden: true,
        meta: {
          title: "模型详情",
          icon: "list"
        }
      },

      {
        path: "hostResource",
        name: "hostResource",
        component: () => import("@/views/cmdb/hostResource"),
        meta: {
          title: "主机资源",
          icon: "list"
        }
      },
      {
        path: "serviceTree",
        name: "ZabbixInfo",
        component: () => import("@/views/cmdb/serviceTree"),
        meta: {
          title: "服务树",
          icon: "list"
        }
      },

      {
        path: "item",
        name: "ZabbixInfo",
        component: () => import("@/views/cmdb/item"),
        meta: {
          title: "键值管理",
          icon: "list"
        }
      }
    ]
  }
];
