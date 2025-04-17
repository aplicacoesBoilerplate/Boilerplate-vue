import LoginForm from '@/components/LoginForm.vue'
import AboutCard from '@/views/AboutCard.vue'
import DashboardHomepage from '@/views/DashboardHomepage.vue'
import LoginPage from '@/views/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/login/register',
      name: 'login-register',
      component: LoginForm,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutCard,
    },
    {
      path: '/dashboard',
      name: 'home',
      component: DashboardHomepage,
    },
  ],
})

export default router
