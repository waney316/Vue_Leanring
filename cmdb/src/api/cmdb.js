import request from "@/utils/request";

// 分类创建
export function createClassify(data) {
  return request({
    url: "/api/v1/cmdb/classify/",
    method: "post",
    data
  });
}

// 分类更新, pk：要更新的数据id
export function updateClassify(data, pk) {
  return request({
    url: "/api/v1/cmdb/classify/" + pk + "/",
    method: "put",
    data
  });
}

// 分类删除,pk：要删除对象的id
export function deleteClassify(pk) {
  return request({
    url: "/api/v1/cmdb/classify/" + pk + "/",
    method: "delete"
  });
}

// 获取分类
export function getClassifyList(params) {
  return request({
    url: "/api/v1/cmdb/classify/",
    method: "get",
    params: params
  });
}

//数据字典获取
export function getDataDictList(params) {
  return request({
    url: "/api/v1/cmdb/data_dict/",
    method: "get",
    params: params
  });
}

// 数据字典创建
export function createDataDict(data) {
  return request({
    url: "/api/v1/cmdb/data_dict/",
    method: "post",
    data
  });
}

// 数据字典更新
export function updateDataDict(data, pk) {
  return request({
    url: "/api/v1/cmdb/data_dict/" + pk + "/",
    method: "put",
    data
  });
}

// 数据字典删除
export function deleteDataDict(pk) {
  return request({
    url: "/api/v1/cmdb/data_dict/" + pk + "/",
    method: "delete"
  });
}

// 监控项键值查看
export function getItemList(params) {
  return request({
    url: "/api/v1/cmdb/item/",
    method: "get",
    params: params
  });
}
// 监控项键值更新
export function updateItem(data, pk) {
  return request({
    url: "/api/v1/cmdb/item/" + pk + "/",
    method: "put",
    data: data
  });
}
// 监控项键值删除
export function delItem(pk) {
  return request({
    url: "/api/v1/cmdb/item/" + pk + "/",
    method: "delete"
  });
}
// 监控项键值增加
export function createItem(data) {
  return request({
    url: "/api/v1/cmdb/item/",
    method: "post",
    data: data
  });
}
