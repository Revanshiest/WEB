import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PrizesView from '../views/PrizesView.vue'
import LaureatesView from '../views/LaureatesView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/prizes'
  },
  {
    path: '/prizes',
    name: 'Prizes',
    component: PrizesView
  },
  {
    path: '/laureates',
    name: 'Laureates',
    component: LaureatesView
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

