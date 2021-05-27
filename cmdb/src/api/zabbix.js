import request from '@/utils/request'

// zabbix数据源获取
export function getZabbixList(params) {
  return request({
    url: '/api/v1/zabbix/info/',
    method: 'get',
    params
  })
}

// zabbix数据源新建
export function createZabbix(data) {
  return request({
    url: '/api/v1/zabbix/info/',
    method: 'post',
    data: data
  })
}

// 测试zabbix api连通性
export function testZabbix(data) {
  return request({
    url: '/api/v1/zabbix/login/',
    method: 'post',
    data: data
  })
}

// zabbix数据源更新
export function updateZabbix(data, pk) {
  return request({
    url: '/api/v1/zabbix/info/' + pk + '/',
    method: 'put',
    data: data
  })
}

// zabbix数据源删除
export function deleteZabbix(pk) {
  return request({
    url: '/api/v1/zabbix/info/' + pk + '/',
    method: 'delete',
  })
}

// 登录
export function loginZabbix(data) {
  return request({
    url: '/api/v1/zabbix/login/',
    method: "post",
    data: data
  })
}

//获取模版列表
export function listTemplate(params) {
  return request({
    url: '/api/v1/zabbix/template/',
    method: "get",
    params
  })
}

//删除模板
export function delTemplate(data) {
  return request({
    url: '/api/v1/zabbix/template/',
    method: "delete",
    data: data
  })
}

//更新模版名称
export function updateTemplate(data) {
  return request({
    url: '/api/v1/zabbix/template/',
    method: "put",
    data: data
  })
}
//获取主机组列表
export function listHostGroup(params) {
  return request({
    url: '/api/v1/zabbix/hostgroup/',
    method: "get",
    params
  })
}

//删除主机组列表
export function delHostGroup(data) {
  return request({
    url: '/api/v1/zabbix/hostgroup/',
    method: "delete",
    data: data
  })
}

//更新主机组名称
export function updateHostGroup(data) {
  return request({
    url: '/api/v1/zabbix/hostgroup/',
    method: "put",
    data: data
  })
}

//创建主机组
export function createHostGroup(data) {
  return request({
    url: '/api/v1/zabbix/hostgroup/',
    method: "post",
    data: data
  })
}


//获取主机列表
export function listHost(params) {
  return request({
    url: '/api/v1/zabbix/host/',
    method: "get",
    params
  })
}

//获取代理列表
export function listProxy(params) {
  return request({
    url: '/api/v1/zabbix/proxy/',
    method: "get",
    params
  })
}

// 创建主机
export function hostCreate(data) {
  return request({
    url: '/api/v1/zabbix/op_host_create/',
    method: "post",
    data: data
  })
}

//主机模版操作
export function hostTemplate(data) {
  return request({
    url: '/api/v1/zabbix/op_host_template/',
    method: "post",
    data: data
  })
}

//主机群组操作
export function hostGroup(data) {
  return request({
    url: '/api/v1/zabbix/op_host_group/',
    method: "post",
    data: data
  })
}

//主机接口操作
export function hostManager(data) {
  return request({
    url: '/api/v1/zabbix/op_host/',
    method: "post",
    data: data
  })
}

//获取所有主机群组和主机模版大力
export function listAllHostGroup(params) {
  return request({
    url: '/api/v1/zabbix/all_hostgroups/',
    method: "get",
    params
  })
}

export function listAllTemplates(params) {
  return request({
    url: '/api/v1/zabbix/all_templates/',
    method: "get",
    params
  })
}

export function listAllProxies(params) {
  return request({
    url: '/api/v1/zabbix/all_proxy/',
    method: "get",
    params
  })
}
export function socketRequest(params) {
  return request({
    url: '/api/v1/zabbix/showlog/',
    method: "get",
    params
  })
}
