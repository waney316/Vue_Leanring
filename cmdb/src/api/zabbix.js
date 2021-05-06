import request from '@/utils/request'

// 分类创建
export function getZabbixList() {
  return request({
    url: '/api/v1/zabbix/info/',
    method: 'get',
  })
}
