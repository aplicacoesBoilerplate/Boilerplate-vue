// Enums
import { ERecursosFiltro } from '@/models/filters/enums/ERecursosFiltro';
import type { RouteRecordRaw } from 'vue-router';

// Classes
import { CMapeamentosFiltro } from '@/classes/filters/CMapeamentosFiltro';
// Views
import HomeView from '@/views/HomeView.vue';
import PaginaFallbackView from '@/views/PaginaFallbackView.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Inicio',
    component: HomeView,
    meta: {
      title: 'routes.home.title',
      icon: 'mdi-home',
      hotkey: 'cmd+shift+h',
      requiresAuth: true,
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
      requiresAuth: true,
    },
  },
  {
    path: '/info-sistema',
    name: 'InformacoesSistema',
    component: () => import('@/views/InformacoesSistemaView.vue'),
    meta: {
      title: 'routes.systemInfo.title',
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
    path: '/recuperacao-senha',
    name: 'RecuperacaoSenha',
    component: () => import('@/views/RecuperacaoSenhaView.vue'),
    meta: {
      title: 'routes.forgotPassword.title',
      hidden: true,
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/administrativo/AdministrativoView.vue'),
    redirect: { name: 'Usuarios' },
    meta: {
      title: 'routes.adm.title',
      icon: 'mdi-shield-crown',
      hotkey: 'cmd+shift+a',
      requiresAuth: true,
    },
    children: [
      {
        path: '/usuarios',
        name: 'Usuarios',
        component: () => import('@/views/administrativo/filhos/UsuariosView.vue'),
        meta: {
          title: 'routes.adm.children.users.title',
          icon: 'mdi-account-group',
          hotkey: 'cmd+shift+u',
          filterContext: ERecursosFiltro.USUARIOS,
          filterResource: CMapeamentosFiltro.getMapeamento(ERecursosFiltro.USUARIOS),
        },
      },
      {
        path: '/rbac',
        name: 'Rbac',
        component: () => import('@/views/administrativo/filhos/RbacView.vue'),
        meta: {
          title: 'routes.adm.children.rbac.title',
          icon: 'mdi-shield-key',
          hotkey: 'cmd+shift+r',
          filterContext: ERecursosFiltro.RBAC,
          filterResource: CMapeamentosFiltro.getMapeamento(ERecursosFiltro.RBAC),
        },
      },
      {
        path: '/erros',
        name: 'Erros',
        component: () => import('@/views/administrativo/filhos/ErrosView.vue'),
        meta: {
          title: 'routes.adm.children.errors.title',
          icon: 'mdi-sync-alert',
          hotkey: 'cmd+shift+e',
          filterContext: ERecursosFiltro.ERROS,
          filterResource: CMapeamentosFiltro.getMapeamento(ERecursosFiltro.ERROS),
        },
      },
      {
        path: '/health-check',
        name: 'HealthCheck',
        component: () => import('@/views/administrativo/filhos/HealthCheckView.vue'),
        meta: {
          title: 'routes.adm.children.healthCheck.title',
          icon: 'mdi-heart-pulse',
          hotkey: 'cmd+shift+c',
        },
      },
    ],
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: PaginaFallbackView,
    props: { type: '403' },
    meta: {
      hidden: true,
      title: 'routes.forbidden.title',
    },
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: PaginaFallbackView,
    props: { type: '500' },
    meta: {
      hidden: true,
      title: 'routes.serverError.title',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: PaginaFallbackView,
    props: { type: '404' },
    meta: {
      hidden: true,
      title: 'routes.notFound.title',
    },
  },
];
