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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
