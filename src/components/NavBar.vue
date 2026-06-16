<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElInput, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Search, ArrowDown } from '@element-plus/icons-vue'
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

const keyword = ref('')

// 移动端下拉折叠态显示的标签:当前导航项,找不到则回退「首页」
const currentNavLabel = computed(() => {
  const matched = navLinks.find((l) => l.name === route.name)
  return matched ? matched.label : '首页'
})

function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  router.push({ name: 'search', query: { keyword: kw } })
  keyword.value = ''
}

// 移动端:搜索图标进入全屏搜索页
function goSearch() {
  router.push({ name: 'search' })
}

// 移动端:下拉项点击导航
function onNavSelect(to) {
  router.push(to)
}
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner container">
      <RouterLink to="/" class="navbar__brand">个人博客</RouterLink>

      <!-- 移动端:品牌旁的导航下拉(默认显示当前页/首页) -->
      <el-dropdown
        v-if="isMobile"
        class="navbar__nav-dropdown"
        trigger="click"
        placement="bottom-start"
      >
        <button class="navbar__nav-trigger" type="button">
          <span>{{ currentNavLabel }}</span>
          <el-icon class="navbar__nav-arrow"><ArrowDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="link in navLinks"
              :key="link.name"
              :class="{ 'is-active': route.name === link.name }"
              @click="onNavSelect(link.to)"
            >
              {{ link.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

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
        <!-- 桌面 / 平板:搜索框 -->
        <div v-if="!isMobile" class="navbar__search">
          <el-input
            v-model="keyword"
            placeholder="搜索文章…"
            :prefix-icon="Search"
            clearable
            @keyup.enter="doSearch"
          />
        </div>
        <!-- 移动端:搜索图标进搜索页 -->
        <button
          v-if="isMobile"
          class="navbar__icon-btn"
          aria-label="搜索"
          @click="goSearch"
        >
          <el-icon :size="18"><Search /></el-icon>
        </button>
        <ThemeToggle />
      </div>
    </div>
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

/* 移动端导航下拉触发器(胶囊) */
.navbar__nav-dropdown {
  margin-right: auto;
}

.navbar__nav-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border: none;
  border-radius: var(--radius-round, 999px);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  transition:
    background var(--dur-fast) var(--ease-soft),
    transform var(--dur-fast) var(--ease-soft);
}

.navbar__nav-trigger:hover {
  background: color-mix(in srgb, var(--color-primary) 22%, transparent);
}

.navbar__nav-arrow {
  font-size: 12px;
  transition: transform var(--dur-fast) var(--ease-soft);
}

/* 下拉展开时箭头翻转(Element Plus 给触发元素加 aria/visible 状态) */
.navbar__nav-dropdown:deep(.el-dropdown) {
  line-height: normal;
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

/* 图标按钮(搜索):与主题切换按钮一致的尺寸/hover */
.navbar__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-regular);
  border-radius: var(--radius-sm);
  transition:
    background var(--dur-fast) var(--ease-soft),
    color var(--dur-fast) var(--ease-soft);
}

.navbar__icon-btn:hover {
  background: var(--bg-hover);
  color: var(--color-primary);
}

/* 移动端顶栏间距收紧,避免 375px 拥挤 */
@media (max-width: 767px) {
  .navbar__inner {
    gap: 10px;
  }
}
</style>

<style>
/* 下拉菜单当前项高亮(下拉菜单挂在 body 上,需非 scoped) */
.el-dropdown-menu__item.is-active {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}
</style>
