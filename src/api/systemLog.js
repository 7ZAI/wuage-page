import request from '@/utils/request'
import Qs from 'qs'



export function getLogs(data) {
    return request({
      url: '/system/log',
      method: 'get',
      params:data
    })
  }



