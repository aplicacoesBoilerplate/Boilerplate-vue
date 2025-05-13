import DashboardHomepage from '@/views/DashboardHomepage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Profile from '@/views/Profile.vue'
import Report from '@/views/Report.vue'
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
      path: '/report',
      name: 'report',
      component: Report,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
      children: [
        {
          path: '/new',
          name: 'new task',
          component: TasksView,
        },
      ],
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
  ],
})

export default router
