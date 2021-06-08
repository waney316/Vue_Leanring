import request from "@/utils/request";

// zabbix数据源获取
export function getTaskHistory(params) {
  return request({
    url: "/api/v1/tasks/history/",
    method: "get",
    params
  });
}
