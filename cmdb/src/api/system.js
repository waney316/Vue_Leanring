import request from "@/utils/request";

// 获取审计日志
export function getAuditLog(params) {
  return request({
    url: "/api/v1/system/audit_log",
    method: "get",
    params: params
  });
}

// 获取dashboard数据
export function getDashboard() {
  return request({
    url: "api/v1/dashboard",
    method: "get"
  });
}
