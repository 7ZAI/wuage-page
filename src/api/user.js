import request from '@/utils/request'
import Qs from 'qs'
import Axios from 'axios'

export function login(data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/systemUser/login',
    method: 'post',
    data: Qs.stringify(data)
  })
}

export function getUserInfo() {
  return request({
    url: '/systemUser/userInfo',
    method: 'get'
  })
}

export function userlogout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function checkLogin() {
  return request({
    url: '/systemUser/isLogin',
    method: 'get'
  })
}


export function getUserList(queryData) {
  return request({
    url: '/system/user',
    method: 'get',
    // headers:{
    //   'Content-Type': 'application/json',
    // },
    params:queryData,
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'repeat'})
   }
  })
}

export function deleteUser(id){
  return request({
    url:'/system/user/'+id,
    method:'delete'
  })
}

export function deleteUserBatch(param){
  return request({
    url: '/system/user/delete/batch',
    method: 'delete',
    params:param,
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function addUser(params){
  return request({
    url: '/system/user',
    method: 'post',
    data:Qs.stringify(params)
  })
}

export function updateUser(param){
  return request({
    url: '/system/user',
    method: 'put',
    params:param,
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'repeat'})
    }
  })
}

export function updateLocked(param){
  return request({
    url: '/system/user/locked',
    method: 'put',
    params:param,
  })
}



export function getPreparedData(){
  return request({
     url:'/system/user/prepareData',
     method:'get',
    
  })
}

export function getRoles(para,param){
  return request({
     url:'/system/user/roles',
     method:'get',
     params:{userId:param,deptId:para}
  })
}