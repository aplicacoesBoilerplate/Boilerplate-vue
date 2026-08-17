// Ecossistema Vue
import { createRouter, createWebHistory } from 'vue-router';

// Utils
import { CTradutor } from '@/classes/Utils/CTradutor';

// Guards
import { authGuard } from './guards/auth.guard';
import { rbacGuard } from './guards/roles.guard';
// Routes
import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(pTo, pFrom, pSavedPosition) {
    if (pSavedPosition) {
      return pSavedPosition;
    }
    if (pTo.hash) {
      return { el: pTo.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  },
  routes,
});

router.beforeEach((pTo, pFrom, pNext) => {
  const title = pTo.meta.title as string;
  const defaultTitle = CTradutor.traduzir('app.title');

  if (title) {
    const translatedTitle = CTradutor.traduzir(title);
    document.title = `${translatedTitle} - ${defaultTitle}`;
  } else {
    document.title = defaultTitle;
  }
  pNext();
});

router.beforeEach(authGuard);
router.beforeEach(rbacGuard);

export default router;
