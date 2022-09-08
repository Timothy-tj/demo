import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'  //懒加载不在这import


Vue.use(VueRouter)

const routes = [
  {
    path:'/',   //配置默认路由
    redirect:'/login'   //重定向
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    redirect: '/welcome',
    component: () => import('../components/Home.vue'),   //路由懒加载
    children:[    //子路由
      { path: '/welcome',component: () => import('../components/index/Welcome.vue') },
      { path: '/users',component: () => import('../components/user/Users.vue') },
      { path: '/rights',component: () => import('../components/power/Rights.vue') },
      { path: '/roles',component: () => import('../components/power/Roles.vue') },
      { path: '/categories',component: () => import('../components/goods/Cate.vue') },
      { path: '/params',component: () => import('../components/goods/Params.vue') },
      { path: '/goods',component: () => import('../components/goods/List.vue') },
      { path: '/goods/add',component: () => import('../components/goods/Add.vue') },
      { path: '/goods/edit',component: () => import('../components/goods/Edit.vue') },
      { path: '/orders',component: () => import('../components/order/Orders.vue') },

    ]
  }
]

const router = new VueRouter({
  routes
})

// 配置路由守卫
router.beforeEach( (to,from,next) => {    //去哪、来源、下一步
  // 如果访问登录页，放行
  if(to.path === '/login'){
    return next();
  }
  // 如果用户未登录，则跳转至 /login
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  if(!userInfo){
    return next('/login');
  }
  // 如果用户已登录,放行
  next();
})

export default router
