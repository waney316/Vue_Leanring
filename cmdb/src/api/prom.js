import request from "@/utils/request";

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

//热加载prometehus配置和alertmanager
export function reloadProm(pk, params) {
  return request({
    url: "/api/v1/prom/prom_reload/" + pk + "/",
    method: "put",
    data: params
  });
}

export function reloadAlert(pk, params) {
  return request({
    url: "/api/v1/prom/alert_reload/" + pk + "/",
    method: "put",
    data: params
  });
}
