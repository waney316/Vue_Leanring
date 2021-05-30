import request from '@/utils/request'

// 登录获取token
export function login(data) {
  return request({
    url: '/api/v1/jwt-token',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/v1/user/info',
    method: 'get',
  })
}


//logout: 退出登录清空token即可
// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
