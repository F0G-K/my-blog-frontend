<script setup>
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1 class="not-found__code">404</h1>
    <p class="not-found__text">页面走丢了</p>
    <el-button type="primary" @click="router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found__code {
  font-size: 72px;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
}

.not-found__text {
  margin: 12px 0 24px;
  color: var(--text-secondary);
  font-size: 16px;
}
</style>
