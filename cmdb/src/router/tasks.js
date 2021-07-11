import Layout from "@/layout";
export default [
  //数据分类
  {
    path: "/tasks",
    component: Layout,
    name: "Example",
    meta: {
      title: "任务管理",
      icon: "el-icon-s-help"
    },
    children: [
      // {
      //   path: "list",
      //   name: "taskList",
      //   component: () => import("@/views/tasks/index"),
      //   meta: {
      //     title: "定时任务",
      //     icon: "list"
      //   }
      // },
      {
        path: "inspection",
        name: "inspection",
        component: () => import("@/views/tasks/inspection"),
        meta: {
          title: "监控巡检",
          icon: "list"
        }
      },
      {
        path: "report/:id",
        name: "inspection",
        component: () => import("@/views/tasks/report"),
        meta: {
          title: "巡检报告"
        },
        hidden: true
      }
    ]
  }
];
