import request from "@/utils/request";

export function getPromActionList() {
  return request({
    url: "/api/v1/prom/query_prom_action/",
    method: "get"
  });
}

export function getPromList(params) {
  return request({
    url: "/api/v1/prom/prometheus/",
    method: "get",
    params: params
  });
}

export function updateProm(data, pk) {
  return request({
    url: "/api/v1/prom/prometheus/" + pk + "/",
    method: "put",
    data: data
  });
}

export function delProm(pk) {
  return request({
    url: "/api/v1/prom/prometheus/" + pk + "/",
    method: "delete"
  });
}

export function createProm(data) {
  return request({
    url: "/api/v1/prom/prometheus/",
    method: "post",
    data: data
  });
}

export function getAlertList(params) {
  return request({
    url: "/api/v1/prom/alertmanager/",
    method: "get",
    params: params
  });
}

export function updateAlert(data, pk) {
  return request({
    url: "/api/v1/prom/alertmanager/" + pk + "/",
    method: "put",
    data: data
  });
}

export function delAlert(pk) {
  return request({
    url: "/api/v1/prom/alertmanager/" + pk + "/",
    method: "delete"
  });
}

export function createAlert(data) {
  return request({
    url: "/api/v1/prom/alertmanager/",
    method: "post",
    data: data
  });
}

//prometheus/alertmanager  api操作
export function managerProm(pk, params) {
  return request({
    url: `/api/v1/prom/manager_prom/${pk}/`,
    method: "put",
    data: params
  });
}

export function managerAlert(pk, params) {
  return request({
    url: `/api/v1/prom/manager_alert/${pk}/`,
    method: "put",
    data: params
  });
}


// prom api数据查询
export function promQuery(data) {
  return request({
    url: '/api/v1/prom/query_prom_data/',
    method: "post",
    data: data
  })
}

// alertmanager数据查询
export function alertQuery(data) {
  return request({
    url: '/api/v1/prom/query_alert_data/',
    method: "post",
    data: data
  })
}
