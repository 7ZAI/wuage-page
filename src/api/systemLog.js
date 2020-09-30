import request from '@/utils/request'
import Qs from 'qs'



export function getLogs(data) {
    return request({
      url: '/system/logs',
      method: 'get',
      params:data
    })
  }

export function deleteRole(roleId){
  return request({
    url: '/system/role/'+roleId,
    method: 'delete',
  })
}

export function deleteRoleBatch(param){
  return request({
    url: '/system/role/delete/batch',
    method: 'delete',
    params:param,
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

