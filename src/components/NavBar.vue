<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElDrawer, ElInput, ElIcon } from 'element-plus'
import { Search, Menu as MenuIcon } from '@element-plus/icons-vue'
import ThemeToggle from './ThemeToggle.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'

const router = useRouter()
const route = useRoute()
const { isMobile } = useBreakpoint()

const navLinks = [
  { name: 'home', label: '首页', to: '/' },
  { name: 'category', label: '技术分类', to: '/category' },
  { name: 'archive', label: '归档', to: '/archive' },
  { name: 'projects', label: '开源项目', to: '/projects' },
  { name: 'about', label: '关于', to: '/about' },
]

const drawerOpen = ref(false)
const keyword = ref('')

function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  router.push({ name: 'search', query: { keyword: kw } })
  keyword.value = ''
  drawerOpen.value = false
}

// 路由变化时关闭抽屉
watch(
  () => route.fullPath,
  () => {
    drawerOpen.value = false
  },
)
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner container">
      <RouterLink to="/" class="navbar__brand">个人博客</RouterLink>

      <!-- 桌面 / 平板:横向菜单 -->
      <nav v-if="!isMobile" class="navbar__menu">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.to"
          class="navbar__link"
          :class="{ 'is-active': route.name === link.name }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="navbar__actions">
        <div v-if="!isMobile" class="navbar__search">
          <el-input
            v-model="keyword"
            placeholder="搜索文章…"
            :prefix-icon="Search"
            clearable
            @keyup.enter="doSearch"
          />
        </div>
        <ThemeToggle />
        <!-- 移动端:汉堡按钮 -->
        <button
          v-if="isMobile"
          class="navbar__hamburger"
          aria-label="打开菜单"
          @click="drawerOpen = true"
        >
          <el-icon :size="20"><MenuIcon /></el-icon>
        </button>
      </div>
    </div>

    <!-- 移动端抽屉:菜单 + 搜索 + 主题 -->
    <el-drawer
      v-model="drawerOpen"
      title="菜单"
      direction="rtl"
      size="78%"
      :with-header="true"
    >
      <div class="drawer-search">
        <el-input
          v-model="keyword"
          placeholder="搜索文章…"
          :prefix-icon="Search"
          clearable
          @keyup.enter="doSearch"
        />
      </div>
      <nav class="drawer-menu">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.to"
          class="drawer-menu__link"
          :class="{ 'is-active': route.name === link.name }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </el-drawer>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  /* 轻量毛玻璃:仅顶栏使用 */
  background: color-mix(in srgb, var(--bg-surface) 78%, transparent);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
}

.navbar__inner {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.navbar__brand {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background: linear-gradient(120deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.navbar__menu {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.navbar__link {
  padding: 6px 14px;
  border-radius: var(--radius-round, 999px);
  color: var(--text-regular);
  font-size: 15px;
  transition:
    background var(--dur-fast) var(--ease-soft),
    color var(--dur-fast) var(--ease-soft);
}

.navbar__link:hover {
  background: var(--bg-hover);
  color: var(--color-primary);
}

.navbar__link.is-active {
  color: var(--color-primary);
  font-weight: 600;
  background: var(--color-primary-soft);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.navbar__search {
  width: 200px;
}

.navbar__hamburger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-regular);
  border-radius: var(--radius-sm);
}

.navbar__hamburger:hover {
  background: var(--bg-hover);
}

.drawer-search {
  margin-bottom: 16px;
}

.drawer-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-menu__link {
  padding: 12px;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 16px;
}

.drawer-menu__link:hover,
.drawer-menu__link.is-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
</style>
