import { createRouter, createWebHistory } from 'vue-router'
import { auth_isLoggedIn } from '../lib/auth'
import LoginPage from '../views/LoginPage.vue'
import UserFinances from '../views/UserFinances.vue'
import UserInformation from '../views/UserInformation.vue'
import BrotherhoodDirectory from '../views/BrotherhoodDirectory.vue'
// function loadPage(view) {
//   return () =>
//     import(
//       /* webpackChunkName: "view-[request]" */ '@views/${view}'
//     );
// }

const routes = [
  {
    path: '/Finances',
    name: 'UserFinances',
    component: UserFinances,
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
  },
  {
    path: '/BrotherhoodDirectory',
    name: 'BrotherhoodDirectory',
    component: BrotherhoodDirectory
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
