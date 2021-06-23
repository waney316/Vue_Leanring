import request from "@/utils/request";

export function getInfluxdb(params) {
  return request({
    url: "/api/v1/snmptrap/influx_info",
    method: "get",
    params
  });
}


export function delInfluxdb(id) {
  return request({
    url: `/api/v1/snmptrap/influx_info/${id}`,
    method: "delete",
  });
}

export function createInfluxdb(data) {
  return request({
    url: `/api/v1/snmptrap/influx_info`,
    method: "post",
    data
  });
}

export function updateInfluxdb(id, data) {
  return request({
    url: `/api/v1/snmptrap/influx_info/${id}`,
    method: "put",
    data
  });
}


export function queryTrapInfo(data, params) {
  return request({
    url: `/api/v1/snmptrap/query_trap`,
    method: "post",
    params: params,
    data: data
  });
}
