import request from '@/utils/request'

// zabbix数据源获取
export function getZabbixList() {
  return request({
    url: '/api/v1/zabbix/info/',
    method: 'get',
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

// 登录
export function loginZabbix(data) {
  return request({
    url: 'api/v1/zabbix/login/',
    method: "post",
    data: data
  })
}

//获取模版列表
export function listTemplate(params) {
  return request({
    url: 'api/v1/zabbix/template',
    method: "get",
    params
  })
}
