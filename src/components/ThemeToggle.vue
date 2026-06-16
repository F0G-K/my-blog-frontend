<script setup>
import { computed } from 'vue'
import { ElTooltip } from 'element-plus'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/store/theme'

const theme = useThemeStore()
const label = computed(() => (theme.isDark ? '切换到浅色' : '切换到深色'))
</script>

<template>
  <el-tooltip :content="label" placement="bottom">
    <button class="theme-toggle" :aria-label="label" @click="theme.toggle()">
      <Transition name="toggle-spin" mode="out-in">
        <el-icon v-if="theme.isDark" :size="18" key="moon"><Moon /></el-icon>
        <el-icon v-else :size="18" key="sun"><Sunny /></el-icon>
      </Transition>
    </button>
  </el-tooltip>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-regular);
  transition:
    background var(--dur-fast) var(--ease-soft),
    color var(--dur-fast) var(--ease-soft);
}

.theme-toggle:hover {
  background: var(--bg-hover);
  color: var(--color-primary);
}

/* 日/月图标切换:微旋转 + 淡入 */
.toggle-spin-enter-active,
.toggle-spin-leave-active {
  transition:
    opacity var(--dur-fast) var(--ease-soft),
    transform var(--dur-fast) var(--ease-soft);
}

.toggle-spin-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}

.toggle-spin-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}
</style>
