<script setup>
/**
 * 前台默认布局:顶部导航 + 三栏。
 *  - 桌面(≥1024):左个人信息卡 + 中内容(含右索引,由各页 .page-grid 实现)
 *  - 平板(768–1023):隐藏左栏,保留中内容 + 右索引
 *  - 移动(<768):单栏,左栏个人信息下移到底部
 * 中 / 右两栏由各页面用 .page-grid 自行组织。
 */
import NavBar from '@/components/NavBar.vue'
import ProfileCard from '@/components/ProfileCard.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'

const { isDesktop, isMobile } = useBreakpoint()
</script>

<template>
  <div class="default-layout">
    <NavBar />

    <div class="default-layout__body container">
      <!-- 左栏:个人信息(桌面固定) -->
      <aside v-if="isDesktop" class="default-layout__left">
        <ProfileCard />
      </aside>

      <!-- 中 + 右:页面内容 -->
      <main class="default-layout__main">
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>

        <!-- 移动端:个人信息下移到底部 -->
        <div v-if="isMobile" class="default-layout__mobile-profile">
          <ProfileCard />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.default-layout__body {
  flex: 1;
  display: flex;
  gap: var(--layout-gap);
  padding-top: var(--layout-gap);
  padding-bottom: var(--layout-gap);
}

.default-layout__left {
  flex-shrink: 0;
  width: var(--left-col-width);
  position: sticky;
  top: calc(var(--header-height) + var(--layout-gap));
  align-self: flex-start;
}

.default-layout__main {
  flex: 1;
  min-width: 0;
}

.default-layout__mobile-profile {
  margin-top: var(--layout-gap);
}
</style>
