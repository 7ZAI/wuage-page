import request from '@/utils/request'
import Qs from 'qs'



export function getRoles(data) {
    return request({
      url: '/system/role',
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

export function updateRole(role){
  return request({
    url: '/system/role',
    method: 'put',
    data:Qs.stringify(role)
  })
}

export function updateRoleStatus(role){
  return request({
    url: '/system/role/status',
    method: 'put',
    data:Qs.stringify(role)
  })
}



export function updateRoleDataRange(param){
  return request({
    url: '/system//role/dataRange',
    method: 'put',
    headers:{
      'Content-Type': 'application/json',
    },
    data:param
  })
}

export function addRole(role){
  return request({
    url: '/system/role',
    method: 'post',
    data:Qs.stringify(role)
  })
}

export function getMenus(){
  return request({
    url: '/system/role/menus',
    method: 'get',
  })
}

export function getMenusSelected(params){
  return request({
    url: '/system/role/menusSelected',
    method: 'get',
    params:{roleId:params}
  })
}


export function getDeptTree(){
  return request({
    url: '/system/role/deptTree',
    method: 'get',
  })
}

export function getSelectedDeptTree(params){
  return request({
    url: '/system/role/selectedDeptTree',
    method: 'get',
    params:{roleId:params}
  })
}
