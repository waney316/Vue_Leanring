import request from "@/utils/request";

// 监控项键值查看
export function getItemList(params) {
  return request({
    url: "/api/v1/cmdb/item",
    method: "get",
    params: params
  });
}
// 监控项键值更新
export function updateItem(data, pk) {
  return request({
    url: `/api/v1/cmdb/item/${pk}`,
    method: "put",
    data: data
  });
}
// 监控项键值删除
export function delItem(pk) {
  return request({
    url: `/api/v1/cmdb/item/${pk}`,
    method: "delete"
  });
}
// 监控项键值增加
export function createItem(data) {
  return request({
    url: "/api/v1/cmdb/item",
    method: "post",
    data: data
  });
}

//获取模型列表
export function getModelGroupList() {
  return request({
    url: "/api/v1/cmdb/model_group",
    method: "get"
  });
}
//新建服务模型分组
export function createModelGroup(data) {
  return request({
    url: "/api/v1/cmdb/model_group",
    method: "post",
    data: data
  });
}
//修改服务模型分组
export function updateModelGroup(id, data) {
  return request({
    url: `/api/v1/cmdb/model_group/${id}`,
    method: "put",
    data
  });
}
//删除服务模型分组
export function deleteModelGroup(id) {
  return request({
    url: `/api/v1/cmdb/model_group/${id}`,
    method: "delete"
  });
}

//模型详情
export function getModelDetails(id) {
  return request({
    url: `/api/v1/cmdb/model/details/${id}`,
    method: "get"
  });
}

export function getModelList(id) {
  return request({
    url: `/api/v1/cmdb/model`,
    method: "get"
  });
}

//创建模型
export function createModel(data) {
  return request({
    url: "/api/v1/cmdb/model",
    method: "post",
    data: data
  });
}
//修改服务模型
export function updateModel(id, data) {
  return request({
    url: `/api/v1/cmdb/model/${id}`,
    method: "put",
    data
  });
}
//删除服务模型
export function deleteModel(id) {
  return request({
    url: `/api/v1/cmdb/model/${id}`,
    method: "delete"
  });
}

createField, updateField, delField;

//新建字段
export function createField(data) {
  return request({
    url: "/api/v1/cmdb/field",
    method: "post",
    data: data
  });
}
//修改字段
export function updateField(id, data) {
  return request({
    url: `/api/v1/cmdb/field/${id}`,
    method: "put",
    data
  });
}
//删除字段
export function delField(id) {
  return request({
    url: `/api/v1/cmdb/field/${id}`,
    method: "delete"
  });
}

//获取主机资源
export function getHostResource(params) {
  return request({
    url: `/api/v1/cmdb/resource`,
    method: "get",
    params
  });
}

//添加主机资源
export function createHostResource(data) {
  return request({
    url: `/api/v1/cmdb/resource`,
    method: "post",
    data
  });
}

//删除主机资源
export function delHostResource(id) {
  return request({
    url: `/api/v1/cmdb/resource/${id}`,
    method: "delete"
  });
}

//更新主机资源
export function updateHostResource(id, data) {
  return request({
    url: `/api/v1/cmdb/resource/${id}`,
    method: "put",
    data: data
  });
}

//获取单个主机资源
export function getHostDetail(id) {
  return request({
    url: `/api/v1/cmdb/resource/${id}`,
    method: "get"
  });
}
