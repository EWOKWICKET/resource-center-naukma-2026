import { createRouter, createWebHistory } from 'vue-router';
import { requireAdmin, guestOnly } from './guards';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/books/:id',
      component: () => import('@/pages/BookDetailPage.vue'),
    },
    {
      path: '/login',
      component: () => import('@/pages/LoginPage.vue'),
      beforeEnter: guestOnly,
    },
    {
      path: '/register',
      component: () => import('@/pages/RegisterPage.vue'),
      beforeEnter: guestOnly,
    },
    {
      path: '/verify/:userId',
      component: () => import('@/pages/VerifyEmailPage.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/pages/admin/AdminDashboard.vue'),
      beforeEnter: requireAdmin,
    },
    {
      path: '/admin/books',
      component: () => import('@/pages/admin/AdminBooksPage.vue'),
      beforeEnter: requireAdmin,
    },
    {
      path: '/admin/categories',
      component: () => import('@/pages/admin/AdminCategoriesPage.vue'),
      beforeEnter: requireAdmin,
    },
  ],
});

export default router;
