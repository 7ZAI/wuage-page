import { getSysConfig } from '@/api/systemConfig'

const state = {
  systemConfig:{}
}

const mutations ={
    SET_CONFIG:(state,systemConfig) => {
        state.systemConfig = systemConfig
    }
}

const actions = {
  
  getSysConfig({ commit }, state) {
    return new Promise((resolve, reject) => {
    getSysConfig().then(response => {
        // console.log(response.data);
        commit('SET_CONFIG', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

