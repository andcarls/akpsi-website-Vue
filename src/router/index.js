import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import LoginPage from '../views/LoginPage.vue'
import UserDashboard from '../views/UserDashboard.vue'

// function loadPage(view) {
//   return () =>
//     import(
//       /* webpackChunkName: "view-[request]" */ '@views/${view}'
//     );
// }

const routes = [
  {
    path: '/Dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
  },
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const currentSession = supabase.auth.getSession();
  if (to.name !== 'login-page' && !currentSession) {
    return { name: 'LoginPage' }
  }
})

export default router
