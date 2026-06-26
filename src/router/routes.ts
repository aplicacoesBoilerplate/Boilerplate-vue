// Ecossistema Vue
import type { RouteRecordRaw } from 'vue-router';

// Classes
import { ClassMapeamentosFiltro } from '@/classes/filters/ClassMapeamentosFiltro';

// Types e Interfaces
import type { TCamposFiltroUsuario } from '@/models/model/usuario/MapeamentoFiltrosUsuario';

// Enums
import { ERecursosFiltro } from '@/models/filters/enums/ERecursosFiltro';

// Views
import HomeView from '@/views/HomeView.vue';
import ErrorsView from '@/views/ErrorsView.vue';

export const routes: Array<RouteRecordRaw> = [
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
    path: '/system-info',
    name: 'SystemInfo',
    component: () => import('@/views/SystemInfoView.vue'),
    meta: {
      title: 'routes.home.title',
      hidden: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'routes.login.title',
      hidden: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: {
      title: 'routes.forgotPassword.title',
      hidden: true,
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
      filterResource: ClassMapeamentosFiltro.getMapeamento<TCamposFiltroUsuario>(ERecursosFiltro.USUARIOS),
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
    },
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: ErrorsView,
    props: { type: '500' },
    meta: {
      hidden: true,
      title: 'routes.serverError.title',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorsView,
    props: { type: '404' },
    meta: {
      hidden: true,
      title: 'routes.notFound.title',
    },
  },
];
