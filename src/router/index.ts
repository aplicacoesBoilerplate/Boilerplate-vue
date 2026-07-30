// Ecossistema Vue
import { createRouter, createWebHistory } from 'vue-router';

import { i18n } from '@/plugins/i18n';

// Guards
import { authGuard } from './guards/auth.guard';
import { rbacGuard } from './guards/roles.guard';

// Routes
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  },
  routes,
});

router.beforeEach((to, from, next) => {
  const title = to.meta.title as string;
  // @ts-ignore
  const defaultTitle = i18n.global.t('app.title');

  if (title) {
    // @ts-ignore
    const translatedTitle = i18n.global.t(title);
    document.title = `${translatedTitle} - ${defaultTitle}`;
  } else {
    document.title = defaultTitle;
  }
  next();
});

// router.beforeEach(authGuard);
// router.beforeEach(rbacGuard);

export default router;
