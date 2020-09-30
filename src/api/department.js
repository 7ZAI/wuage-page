import request from '@/utils/request'
import Qs from 'qs'
import Axios from 'axios'


export function getDepts(data){
    return request({
       url:'/system/departments',
       method:'get',
       params:data
    })
}

export function addDept(dept){
    return request({
        url:'/system/departments',
        method:'post',
        data: Qs.stringify(dept)
    })
}

export function updateDept(dept){
  return request({
    url: '/system/departments',
    method: 'put',
    data:Qs.stringify(dept)
  })
}

export function deleteDept(deptId){
    return request({
      url: '/system/departments/'+deptId,
      method: 'delete',
    })
  }


