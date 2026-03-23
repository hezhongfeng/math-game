import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import DifficultySelect from './pages/DifficultySelect.vue'
import Game from './pages/Game.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/difficulty',
    name: 'DifficultySelect',
    component: DifficultySelect
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: Game,
    props: true
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
