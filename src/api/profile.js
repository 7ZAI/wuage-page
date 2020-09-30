import request from '@/utils/request'
import Qs from 'qs'


export function updateProfile(param){
    return request({
      url: '/system/profile',
      method: 'put',
      data:Qs.stringify(param)
    })
  }

  
export function updatePwd(param){
  return request({
    url: '/system/profile/password',
    method: 'put',
    data:Qs.stringify(param)
  })
}