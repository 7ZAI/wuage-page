import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import {getToken} from '@/utils/auth'
import {checkLogin,getisLogin} from '@/api/globaldata'


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  console.log(to)
 

  if(typeof(getisLogin()) == 'undefined'){
    await checkLogin()
  }

  if (getisLogin()) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next()
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      console.log('用户信息----'+hasGetUserInfo)
      if (hasGetUserInfo) {
        console.log('用户信息----存在')
        if (to.matched.length ===0) {  //如果未匹配到路由
          next('/index')   //防止退出再登录别的角色时，由于无权限 路由匹配不到（出现空白页） ,直接去首页
        } else{
          next()
        }
        
      } else {
        try {
          console.log(store.getters)
          console.log('查询信息')
          await store.dispatch('user/getInfo')
          if (to.matched.length ===0) {  //如果未匹配到路由
            next('/index')   //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
          } else{
            next({
              ...to,
              replace:true
            })
          }
         
        } catch (error) {
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      // console.log('sssss')
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
