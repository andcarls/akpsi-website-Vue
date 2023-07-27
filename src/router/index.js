import { createRouter, createWebHistory } from 'vue-router'
import { auth_isLoggedIn } from '../lib/auth'
import LoginPage from '../views/LoginPage.vue'
import UserDashboard from '../views/UserDashboard.vue'
import UserInformation from '../views/UserInformation.vue'
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
  {
    path: '/UserInformation',
    name: 'UserInformation',
    component: UserInformation
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const signedIn = await auth_isLoggedIn();
  if (to.path === '/') {
    if (!signedIn) {
      return;
    }
    else {
      return '/Dashboard';
    }
  }
  else if (!signedIn) {
    console.log('Please Log In');
    return { name: 'LoginPage' }
  }
})

export default router
