import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/modules/Main/Login';
import Home from '../components/modules/Main/Home.vue';
import Export from '../components/modules/ExportTools/Export';
import ExportSettings from '../components/modules/ExportTools/Settings/settings';
import ExportCustom from '../components/modules/ExportTools/Custom/custom';
import PlexTV from '../components/modules/PlexTV/PlexTV';
import PMS from '../components/modules/PMS/PMS';
import PMSSettings from '../components/modules/PMS/Settings/settings';
import Butler from '../components/modules/PMS/Butler/butler';
import Language from '../components/modules/Main/Language.vue';
import GlobalSettings from '../components/modules/Main/GlobalSettings';
import DVR from '../components/modules/PMS/DVR/DVR';
import FindMedia from '../components/modules/PMS/FindMedia/FindMedia';
import FindMediaSettings from '../components/modules/PMS/FindMedia/Settings/FindMediaSettings';
import LibraryMapping from '../components/modules/PMS/LibraryMapping/LibraryMapping';
import ViewState from '../components/modules/PMS/ViewState/ViewState';
import About from '../components/modules/Main/About';
import Store from '../store/index.js';

Vue.use(VueRouter)

  const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes: [
  {
    path: '/',
    name: "/",
    component: Home,
    meta: {requiresAuth: true}
  },
  {
    path: '/login',
    name: 'login',
    component: Login

  },
  {
    path: '/home',
    name: "home",
    component: Home,
    meta: {requiresAuth: true}
  },
  {
    path: '/export',
    name: "export",
    component: Export,
    meta: {requiresAuth: true}
  },
  {
    path: '/export/settings',
    name: "exportsettings",
    component: ExportSettings,
    meta: {requiresAuth: true}
  },
  {
    path: '/export/custom',
    name: "exportcustom",
    component: ExportCustom,
    meta: {requiresAuth: true}
  },
  {
    path: '/pms',
    name: "pms",
    component: PMS,
    meta: {requiresAuth: true}
  },
  {
    path: '/pms/settings',
    name: "pmssettings",
    component: PMSSettings,
    meta: {requiresAuth: true}
  },
  {
    path: '/pms/butler',
    name: "butler",
    component: Butler,
    meta: {requiresAuth: true}
  },
  {
    path: '/pms/viewstate',
    name: "viewstate",
    component: ViewState,
    meta: {requiresAuth: true}
  },
  {
    path: '/plextv',
    name: "plextv",
    component: PlexTV,
    meta: {requiresAuth: true}
  },
  {
    path: '/pms/dvr',
    name: "dvr",
    component: DVR,
    meta: {requiresAuth: true}
  },
  {
    path: '/pms/findmedia',
    name: "FindMedia",
    component: FindMedia,
    meta: {requiresAuth: true}
  },
  {
    path: '/pms/findmedia/Settings',
    name: "FindMediaSettings",
    component: FindMediaSettings,
    meta: {requiresAuth: true}
  },
  {
    path: '/pms/libmapping',
    name: "LibraryMapping",
    component: LibraryMapping,
    meta: {requiresAuth: true}
  },
  {
    path: '/language',
    name: "language",
    component: Language,
    meta: {requiresAuth: true}
  },
  {
    path: '/settings',
    name: "settings",
    component: GlobalSettings,
    meta: {requiresAuth: true}
  },
  {
    path: '/about',
    name: "about",
    component: About,
    meta: {requiresAuth: true}
  }
]});

router.beforeEach( (to,from,next) => {
  let routerAuthCheck = Store.state.plextv.authenticated;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if(routerAuthCheck){
      next();
    } else {
      router.replace('/login')
    }

  } else {
    //allows routing
    next();
  }
});



export default router
