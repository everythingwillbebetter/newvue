import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'

Vue.use(Router)

const router= new Router({
  routes: [
    {path: '/',redirect:'/home'},
    {path: '/login',component: Login},
    {path: '/home',component: Home,
    redirect:'welcome',
    children:[{path:'/welcome',component:Welcome}]
  }
      // path: '/',name: 'HelloWorld',component: HelloWorld}
  ]
})

// 给router设置路由守卫，非登录用户禁止访问
router.beforeEach((to, from, next) => {
  // 获取token，并判断是否存在
  var token = window.sessionStorage.getItem('token')
  if(token===null&& to.path!=='/login'){
    // 强制跳转页面
    return next('/login')
  }
  next() // 路由继续执行
})

export default router
