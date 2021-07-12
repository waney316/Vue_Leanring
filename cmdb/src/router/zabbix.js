import Layout from "@/layout";
export default [
  //zabbix管理
  {
    path: "/zabbix",
    component: Layout,
    name: "Example",
    meta: {
      title: "ZBX管理",
      icon: "el-icon-cherry"
    },
    children: [{
        path: "info",
        name: "ZabbixInfo",
        component: () => import("@/views/zabbix/zabbixInfo"),
        meta: {
          title: "数据源",
          icon: "list"
        }
      },
      {
        path: "template",
        name: "templteManger",
        component: () => import("@/views/zabbix/template"),
        meta: {
          title: "模板管理",
          icon: "form"
        }
      },

      {
        path: "hostgroup",
        name: "hostgroupManger",
        component: () => import("@/views/zabbix/hostgroup"),
        meta: {
          title: "主机组管理",
          icon: "nested"
        }
      },
      {
        path: "host",
        name: "hostManger",
        component: () => import("@/views/zabbix/host"),
        meta: {
          title: "主机管理",
          icon: "tree"
        }
      },
      {
        path: "alert",
        name: "alertManger",
        component: () => import("@/views/zabbix/alert"),
        meta: {
          title: "告警查询",
          icon: "message"
        }
      },
      {
        path: "data",
        name: "dataSearch",
        component: () => import("@/views/zabbix/data"),
        meta: {
          title: "数据查询",
          icon: "eye-open"
        }
      },
      {
        path: "operation",
        name: "operation",
        component: () => import("@/views/zabbix/operation"),
        meta: {
          title: "API操作",
          icon: "eye-open"
        }
      }
    ]
  }
];
