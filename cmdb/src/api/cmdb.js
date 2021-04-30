import request from '@/utils/request'

export function createClassify(data) {
  return request({
    url: '/api/v1/classify',
    method: 'post',
    data
  })
}
