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
      <el-icon :size="18">
        <Moon v-if="theme.isDark" />
        <Sunny v-else />
      </el-icon>
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
  transition: background 0.2s ease, color 0.2s ease;
}

.theme-toggle:hover {
  background: var(--bg-hover);
  color: var(--color-primary);
}
</style>
