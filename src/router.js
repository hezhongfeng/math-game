import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/Home.vue')
  },
  {
    path: '/difficulty',
    name: 'DifficultySelect',
    component: () => import('./pages/DifficultySelect.vue')
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: () => import('./pages/Game.vue'),
    props: true
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

export default router
