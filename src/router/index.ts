import AboutCard from '@/views/AboutCard.vue'
import DashboardHomepage from '@/views/DashboardHomepage.vue'
import LoginPage from '@/views/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RegisterForm from '@/components/RegisterForm.vue'
import Profile from '@/views/Profile.vue'
import Configurations from '@/views/Configurations.vue'
import Report from '@/views/Report.vue'
import TasksView from '@/views/TasksView.vue'

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
      component: RegisterForm,
    },
    {
      path: '/dashboard',
      name: 'home',
      component: DashboardHomepage,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutCard,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/config',
      name: 'configurations',
      component: Configurations,
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
  ],
})

export default router
