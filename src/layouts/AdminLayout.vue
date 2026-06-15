<script setup>
/**
 * 后台管理布局:侧边菜单 + 顶部条。响应式:移动端菜单收为抽屉。
 */
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElMenu,
  ElMenuItem,
  ElIcon,
  ElDrawer,
  ElButton,
  ElMessageBox,
} from 'element-plus'
import {
  Document,
  ChatLineSquare,
  FolderOpened,
  Setting,
  Fold,
  SwitchButton,
  Back,
} from '@element-plus/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/store/auth'
import { useBreakpoint } from '@/composables/useBreakpoint'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { isMobile } = useBreakpoint()

const drawerOpen = ref(false)

const menus = [
  { index: '/admin/articles', label: '文章管理', icon: Document },
  { index: '/admin/comments', label: '评论审核', icon: ChatLineSquare },
  { index: '/admin/projects', label: '项目管理', icon: FolderOpened },
  { index: '/admin/site-info', label: '站点信息', icon: Setting },
]

function onSelect(index) {
  router.push(index)
  drawerOpen.value = false
}

async function logout() {
  await ElMessageBox.confirm('确定退出登录?', '提示', { type: 'warning' }).catch(() => 'cancel')
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-layout">
    <!-- 侧栏(桌面) -->
    <aside v-if="!isMobile" class="admin-aside">
      <div class="admin-aside__brand">博客后台</div>
      <el-menu :default-active="route.path" class="admin-menu" @select="onSelect">
        <el-menu-item v-for="m in menus" :key="m.index" :index="m.index">
          <el-icon><component :is="m.icon" /></el-icon>
          <span>{{ m.label }}</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <div class="admin-main">
      <header class="admin-header">
        <button v-if="isMobile" class="admin-header__menu" @click="drawerOpen = true">
          <el-icon :size="20"><Fold /></el-icon>
        </button>
        <span class="admin-header__title">{{ route.meta.title || '管理后台' }}</span>
        <div class="admin-header__actions">
          <el-button text :icon="Back" @click="router.push('/')">回到前台</el-button>
          <ThemeToggle />
          <el-button text :icon="SwitchButton" @click="logout">退出</el-button>
        </div>
      </header>

      <section class="admin-content">
        <RouterView />
      </section>
    </div>

    <!-- 移动端抽屉菜单 -->
    <el-drawer v-model="drawerOpen" title="博客后台" direction="ltr" size="70%">
      <el-menu :default-active="route.path" @select="onSelect">
        <el-menu-item v-for="m in menus" :key="m.index" :index="m.index">
          <el-icon><component :is="m.icon" /></el-icon>
          <span>{{ m.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-page);
}

.admin-aside {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-color);
}

.admin-aside__brand {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.admin-menu {
  border-right: none;
}

.admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.admin-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}

.admin-header__menu {
  border: none;
  background: transparent;
  color: var(--text-regular);
}

.admin-header__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.admin-header__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}
</style>
