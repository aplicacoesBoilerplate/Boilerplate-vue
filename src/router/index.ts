import DashboardHomepage from '@/views/DashboardView.vue'
import LoginPage from '@/views/LoginView.vue'
import RegisterPage from '@/views/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Profile from '@/views/ProfileView.vue'
import TasksView from '@/views/TasksView.vue'
import UsersView from '@/views/UsersView.vue'

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
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
  ],
})

export default router
