import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { i18n } from '@/plugins/i18n'
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
      title: 'routes.home.title',
      icon: 'mdi-home',
      hotkey: 'cmd+shift+h',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'routes.login.title',
      hidden: true
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'routes.dashboard.title',
      icon: 'mdi-view-dashboard',
      hotkey: 'cmd+shift+d',
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/UsersView.vue'),
    meta: {
      title: 'routes.users.title',
      icon: 'mdi-account-group',
      hotkey: 'cmd+shift+u',
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/DashboardView.vue'),
    redirect: { name: 'AdminUsers' },
    meta: {
      title: 'routes.adm.title',
      icon: 'mdi-shield-crown',
      hotkey: 'cmd+shift+a',
      requiresAuth: true,
      authorize: ['admin'],
    },
    children: [
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'routes.adm.children.users.title',
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
          title: 'routes.adm.children.settings.title',
          icon: 'mdi-cog',
          hotkey: 'cmd+shift+c',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: ErrorsView,
    props: { type: '403' },
    meta: {
      hidden: true,
      title: 'routes.forbidden.title',
    }
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: ErrorsView,
    props: { type: '500' },
    meta: {
      hidden: true,
      title: 'routes.serverError.title',
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorsView,
    props: { type: '404' },
    meta: {
      hidden: true,
      title: 'routes.notFound.title',
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title as string
  // @ts-ignore: Dependendo da versão do TS, o acesso ao global pode pedir tipagem extra
  const defaultTitle = i18n.global.t('project.title')

  if (title) {
    // @ts-ignore
    const translatedTitle = i18n.global.t(title)
    document.title = `${translatedTitle} - ${defaultTitle}`
  } else {
    document.title = defaultTitle
  }

  next()
})

router.beforeEach(authGuard)
router.beforeEach(rbacGuard)

export default router
