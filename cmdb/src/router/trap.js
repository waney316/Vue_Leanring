import Layout from "@/layout";

export default [
  //snmpTrap管理
  {
    path: "/snmptrap",
    component: Layout,
    name: "Example",
    meta: {
      title: "Trap管理",
      icon: "el-icon-s-open"
    },
    children: [
      {
        path: "traps",
        name: "PromInfo",
        // component: () => import('@/views/prom/promInfo'),
        meta: {
          title: "Trap查询",
          icon: "el-icon-s-open"
        }
      },
      {
        path: "config",
        name: "PromInfo",
        // component: () => import('@/views/prom/promInfo'),
        meta: {
          title: "Trap配置",
          icon: "el-icon-s-open"
        }
      }
    ]
  }
];
