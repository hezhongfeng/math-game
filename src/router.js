import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/difficulty',
    name: 'DifficultySelect',
    component: () => import('./pages/DifficultySelect.vue'),
    meta: { title: '选择关卡' }
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: () => import('./pages/Game.vue'),
    props: true,
    meta: { title: '闯关' }
  },
  {
    path: '/explore',
    name: 'NumberExplore',
    component: () => import('./pages/NumberExplore.vue'),
    meta: { title: '数字探索' }
  },
  // 404 - 未匹配的路由重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '儿童数学启蒙训练'}｜数感闯关`
})

export default router
