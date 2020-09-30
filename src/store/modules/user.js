import { login, userlogout, getUserInfo, checkLogin } from '@/api/user'
import { resetRouter } from '@/router'
import { setisLogin } from '@/api/globaldata'
import { add } from '@/router'

const state = {
  name: '',
  avatar: '',
  user: {},
  menu: [],
  loginStatus:false
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_LOGINSTATUS: (state, loginStatus) => {
    state.loginStatus = loginStatus
  },

  RESET_ALL:state =>{
    state.name = null
    state.avatar =''
    state.menu = new Array()
    state.user =new Array()
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        setisLogin(true)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state).then(response => {
        const { data } = response
        if (!data) {
          reject('无法获取用户信息，请重新登陆!')
        }
        // console.log(data)
        const { username, avatar } = data
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_USER', data)
        commit('SET_MENU', data.menus)
        // console.log("dddddddd")
        add(data.menus)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // update info
  updateUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state).then(response => {
        const { data } = response
        if (!data) {
          reject('无法获取用户信息，请重新登陆!')
        }
        // console.log(data)
        const { username, avatar } = data
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_USER', data)
        commit('SET_MENU', data.menus)
        // add(data.menus)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      userlogout().then(res => {
        resetRouter()
        console.log(res+'退出登录！')
        commit('RESET_ALL')
        setisLogin(false)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  isLogin({ commit, state }) {
    return new Promise((resolve, reject) => {
      checkLogin().then(responce => {
        commit('SET_LOGINSTATUS', responce.data)
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

