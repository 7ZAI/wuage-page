import request from '@/utils/request'

export function getSysConfig() {
  return request({
    url: '/syste/config',
    method: 'get',
  })
}


