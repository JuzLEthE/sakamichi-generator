import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Msg from '../views/Msg.vue'
import Blog from '../views/Blog.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'msg图制作工具'
    }
  },
  {
    path: '/msg/:group',
    name: 'Msg',
    component: Msg,
    meta: {
      title: 'msg图制作'
    }
  },
  {
    path: '/msg',
    redirect: '/msg/hinata'
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: {
      title: '博客图制作'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

const mapping = { hinata: '日向坂46', sakura: '櫻坂46', nogi: '乃木坂46' }

router.beforeEach((to, from, next) => {
  let groupName = mapping[to.params.group]

  document.title = (groupName ? groupName : '坂道') + to.meta?.title
  next()
})

export default router
