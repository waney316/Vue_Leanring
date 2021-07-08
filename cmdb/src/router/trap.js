import Layout from "@/layout";

export default [
  //snmpTrap管理
  {
    path: "/snmptrap",
    component: Layout,
    name: "Example",
    meta: {
      title: "TRAP查询",
      icon: "el-icon-s-open"
    },
    children: [{
        path: "influxdb",
        name: "influxdb",
        component: () => import('@/views/snmptrap/influxdb'),
        meta: {
          title: "InfluxDB数据源",
          icon: "el-icon-s-open"
        }
      },
      {
        path: "queryTrap",
        name: "queryTrap",
        component: () => import('@/views/snmptrap/queryTrap'),
        meta: {
          title: "Trap查询",
          icon: "el-icon-s-open"
        }
      }
    ]
  }
];
