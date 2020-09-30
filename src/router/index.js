import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const dymaticRoutes = []

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'index',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人资料', icon: 'user', noCache: true }
      }
    ]
  }
]



const constant404Routes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher 
  
  // console.log('重置路由')// reset router

  // console.log(router.matcher)
}

export function add(menudata) {
  handlerMenuData(menudata)
  router.addRoutes(dymaticRoutes)
  router.options.routes = constantRoutes.concat(dymaticRoutes)
}

//处理菜单数据 转换格式为router的格式
function handlerMenuData(data) {
  if (data.length <= 0) {
    return
  }
  let rootMenus = data.filter(ele => ele.parentId === 0)
  // console.log(rootMenus)
  rootMenus.forEach(element => {
    // let childArray = data.filter(ele => ele.parentId === element.menuId)
    let childrens = getChildren(element.menuId, data)
    let layout = undefined
    if(element.componentPath === 'layout'){
      layout = Layout
    }else{
      layout = () =>import(`@/views/${element.componentPath}`)
    }
    let page = {
      path: '' + element.url,
      component:layout,
      meta: { title: element.menuName, icon: element.icon },
      children: []
    }
    if (childrens.length > 0) {
      page.children = childrens
    }
    dymaticRoutes.push(page)
  })
  dymaticRoutes.concat(constant404Routes)
}

function getChildren(pid, allData) {
  let childResult = new Array()
  let childData = allData.filter(ele => ele.parentId === pid)
  let childrens =  new Array()
  if(childData.length>0 && typeof(childData) != undefined){
    childData.forEach(ele =>{
      childrens = getChildren(ele.menuId, allData)
      const page = {
        path: '' + ele.url,
        component:() =>import(`@/views/${ele.componentPath}`),
        meta: { title: ele.menuName, icon: ele.icon },
        children: childrens
      }
      childResult.push(page)
    })
  }
  return childResult
}
export default router
