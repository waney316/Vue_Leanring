import Layout from "@/layout";
export default [
  {
    path: "/system",
    component: Layout,
    name: "system",
    meta: {
      title: "系统管理",
      icon: "el-icon-cherry"
    },
    children: [
      {
        path: "user",
        name: "用户管理",
        component: () => import("@/views/system/user"),
        meta: {
          title: "用户管理",
          icon: "dashboard"
        }
      },
      {
        path: "audit_log",
        name: "操作日志",
        component: () => import("@/views/system/auditLog"),
        meta: {
          title: "日志审计",
          icon: "dashboard"
        }
      }
    ]
  }
];
