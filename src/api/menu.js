import request from '@/utils/request'
import Qs from 'qs'
import Axios from 'axios'


export function getMenus(data) {
    return request({
      url: '/system/user/menus',
      method: 'get',
      params:data
    })
  }

export function deleteMenu(menuId){
  return request({
    url: '/system/menu/'+menuId,
    method: 'delete',
  })
}

export function updateMenu(menu){
  return request({
    url: '/system/menu',
    method: 'put',
    data:Qs.stringify(menu)
  })
}

export function addMenu(menu){
  return request({
    url: '/system/menu',
    method: 'post',
    data:Qs.stringify(menu)
  })
}
