import { createRouter, createWebHistory } from 'vue-router'
import { auth_isLoggedIn } from '../lib/auth'
import LoginPage from '../views/LoginPage.vue'
import UserFinances from '../views/UserFinances.vue'
import UserInformation from '../views/UserInformation.vue'
import BrotherhoodDirectory from '../views/BrotherhoodDirectory.vue'
import AlumniDirectory from '../views/AlumniDirectory.vue'
import AdminLoginPage from '../views/admin/AdminLoginPage.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'

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
  },
  {
    path: '/AlumniDirectory',
    name: 'AlumniDirectory',
    component: AlumniDirectory
  },
  {
    path: '/Admin',
    name: 'AdminLoginPage',
    component: AdminLoginPage
  },
  {
    path: '/AdminDashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
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
      return '/Finances';
    }
  }
  else if (!signedIn) {
    console.log('Please Log In');
    return { name: 'LoginPage' }
  }

})

export default router
