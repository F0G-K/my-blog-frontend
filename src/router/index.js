import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

const SITE_NAME = '个人博客'

/**
 * 路由表。
 *  - 前台公开页嵌套在 DefaultLayout(三栏 + 顶部导航)下。
 *  - 后台管理页嵌套在 AdminLayout 下,meta.requiresAuth 由全局守卫拦截。
 *  - 登录页独立,无布局。
 */
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
      { path: 'category', name: 'category', component: () => import('@/views/Category.vue'), meta: { title: '技术分类' } },
      { path: 'tag/:name', name: 'tag', component: () => import('@/views/Home.vue'), meta: { title: '标签' } },
      { path: 'archive', name: 'archive', component: () => import('@/views/Archive.vue'), meta: { title: '归档' } },
      { path: 'about', name: 'about', component: () => import('@/views/About.vue'), meta: { title: '关于' } },
      { path: 'projects', name: 'projects', component: () => import('@/views/Projects.vue'), meta: { title: '开源项目' } },
      { path: 'article/:id', name: 'article', component: () => import('@/views/ArticleDetail.vue'), meta: { title: '文章' } },
      { path: 'search', name: 'search', component: () => import('@/views/Search.vue'), meta: { title: '搜索' } },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/admin/Login.vue'),
    meta: { title: '管理员登录' },
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/admin/articles',
    children: [
      { path: 'articles', name: 'admin-articles', component: () => import('@/views/admin/ArticleList.vue'), meta: { title: '文章管理' } },
      { path: 'articles/edit/:id?', name: 'admin-article-edit', component: () => import('@/views/admin/ArticleEdit.vue'), meta: { title: '编辑文章' } },
      { path: 'comments', name: 'admin-comments', component: () => import('@/views/admin/Comments.vue'), meta: { title: '评论审核' } },
      { path: 'projects', name: 'admin-projects', component: () => import('@/views/admin/Projects.vue'), meta: { title: '项目管理' } },
      { path: 'site-info', name: 'admin-site-info', component: () => import('@/views/admin/SiteInfo.vue'), meta: { title: '站点信息' } },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面不存在' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// 全局前置守卫:管理路由校验本地 token,无则跳登录
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !getToken()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  // 已登录访问登录页 → 回后台
  if (to.name === 'login' && getToken()) {
    return { path: '/admin' }
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${SITE_NAME}` : SITE_NAME
})

export default router
