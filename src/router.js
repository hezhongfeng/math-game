import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import DifficultySelect from './pages/DifficultySelect.vue'
import Game from './pages/Game.vue'
import ComponentDemo from './pages/ComponentDemo.vue'

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
  {
    path: '/demo',
    name: 'ComponentDemo',
    component: ComponentDemo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
