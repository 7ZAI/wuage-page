import request from '@/utils/request'
import Qs from 'qs'

export function getSysConfig() {
  return request({
    url: '/system/config',
    method: 'get',
  })
}


export function getSysLogInConfig() {
  return request({
    url: '/system/loginConfig',
    method: 'get',
  })
}

export function updateSysConfig(param) {
  return request({
    url: '/system/config',
    method: 'post',
    dataType:'json',
    contentType : 'application/json;charset=utf-8',
    data:Qs.stringify(param)
  })
}


