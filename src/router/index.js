import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      // component: HelloWorld
      component: () => import('@/views/index')
    },
    {
      path: '/graph',
      name: '图表',
      component: () => import('@/views/index')
    }
  ]
})
