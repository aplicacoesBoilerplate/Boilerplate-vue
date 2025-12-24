import { createRouter, createWebHistory, type RouteRecord, type RouteRecordRaw } from 'vue-router'
import { authGuard } from './guards/auth.guard'
import { rbacGuard } from './guards/roles.guard'
import HomeView from '@/views/HomeView.vue'
import ErrorsView from '@/views/ErrorsView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home',
      icon: 'mdi-home',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/DashboardView.vue'),
    redirect: { name: 'AdminUsers' },
    meta: {
      title: 'Administração',
      icon: 'mdi-shield-crown',
      requiresAuth: true,
      authorize: ['admin'],
    },
    children: [
      {
        path: 'usuarios',
        name: 'AdminUsers',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Gerenciar Usuários',
          icon: 'mdi-account-group',
          requiresAuth: true,
          authorize: ['admin'],
        },
      },
      {
        path: 'config',
        name: 'AdminConfig',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Configurações',
          icon: 'mdi-cog',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'AcessoNegado',
    component: ErrorsView,
    props: { type: '403' },
    meta: {
      hidden: true,
      title: 'Acesso Negado'
    }
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: ErrorsView,
    props: { type: '500' },
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorsView,
    props: { type: '404' },
    meta: {
      hidden: true,
      title: 'Página Não Encontrada'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(authGuard)
router.beforeEach(rbacGuard)

export default router
