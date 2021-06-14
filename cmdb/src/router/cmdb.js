import Layout from "@/layout";
export default [
  //数据分类
  {
    path: "/cmdb",
    component: Layout,
    name: "Example",
    meta: {
      title: "数据管理",
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
        path: "asset",
        name: "ZabbixInfo",
        // component: () => import("@/views/cmdb/item"),
        meta: {
          title: "监控资产",
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
