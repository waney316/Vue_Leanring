import request from "@/utils/request";

// 获取任务历史列表
export function getTaskHistory(params) {
  return request({
    url: "/api/v1/tasks/history/",
    method: "get",
    params: params
  });
}

// 删除任务
export function delTaskHistory(pk) {
  return request({
    url: "/api/v1/tasks/history/" + pk,
    method: "delete"
  });
}

//导出任务结果
export function getTaskResult(params) {
  return request({
    url: "/api/v1/tasks/history-result/",
    method: "get",
    params
  });
}

//获取定时任务列表
export function getCronTask(params) {
  return request({
    url: "/api/v1/tasks/cron/",
    method: "get",
    params
  });
}
