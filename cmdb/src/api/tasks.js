import request from "@/utils/request";

// 获取任务列表
export function getTaskHistory() {
  return request({
    url: "/api/v1/tasks/history/",
    method: "get",
  });
}

// 删除任务
export function delTaskHistory(pk) {
  return request({
    url: "/api/v1/tasks/history/" + pk,
    method: "delete",
  });
}