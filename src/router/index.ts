import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginView.vue'
import RegisterPage from '@/views/RegisterView.vue'
import DashboardHomepage from '@/views/DashboardView.vue'
import UsersView from '@/views/UsersView.vue'
import Profile from '@/views/ProfileView.vue'
import MotivosView from '@/views/MotivosView.vue'
import SaidasView from '@/views/SaidasView.vue'
import AutorizacoesView from '@/views/AutorizacoesView.vue'
import PortariaView from '@/views/PortariaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/dashboard',
      name: 'home',
      component: DashboardHomepage,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/saidas',
      name: 'saidas',
      component: SaidasView,
    },
    {
      path: '/autorizacoes',
      name: 'autorizacoes',
      component: AutorizacoesView,
    },
    {
      path: '/motivos',
      name: 'motivos',
      component: MotivosView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/portaria',
      name: 'portaria',
      component: PortariaView,
    },
  ],
})

export default router
