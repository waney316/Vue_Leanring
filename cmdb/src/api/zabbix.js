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

//获取主机组列表
export function listHostGroup(params) {
  return request({
    url: '/api/v1/zabbix/hostgroup/',
    method: "get",
    params
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
