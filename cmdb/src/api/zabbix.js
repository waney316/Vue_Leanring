import request from '@/utils/request'

// 分类创建
export function getZabbixList() {
  return request({
    url: '/api/v1/zabbix/info/',
    method: 'get',
  })
}

// 登录
export function loginZabbix(data){
  return request({
    url: 'api/v1/zabbix/login/',
    method: "post",
    data: data
  })
}

//获取模版列表
export function listTemplate(params){
  return request({
    url: 'api/v1/zabbix/list_template',
    method: "get",
    params
  })
}
