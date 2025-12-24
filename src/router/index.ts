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
      hotkey: 'cmd+shift+h',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      hidden: true,
      title: 'Login'
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      hotkey: 'cmd+shift+d',
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
      hotkey: 'cmd+shift+a',
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
          hotkey: 'cmd+shift+u',
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
          hotkey: 'cmd+shift+c',
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
    meta: {
      hidden: true,
      title: 'Erro interno do servidor'
    }
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
