<script setup>
/**
 * 管理员登录:账号密码 → 存 token → 跳回 redirect 或 /admin。
 */
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
} from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const formRef = ref()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function onSubmit() {
  await formRef.value?.validate().catch(() => false)
  if (!form.username || !form.password) return
  loading.value = true
  try {
    await auth.login({ username: form.username, password: form.password })
    ElMessage.success('登录成功')
    router.push(route.query.redirect || '/admin')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="login__toggle"><ThemeToggle /></div>
    <div class="login__card">
      <h1 class="login__title">博客后台</h1>
      <p class="login__subtitle">请使用管理员账号登录</p>
      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="onSubmit">
        <el-form-item prop="username">
          <el-input v-model="form.username" :prefix-icon="User" placeholder="账号" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :prefix-icon="Lock"
            placeholder="密码"
            size="large"
            show-password
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-button type="primary" size="large" class="login__btn" :loading="loading" @click="onSubmit">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* 淡蓝紫渐变 + 两处极淡柔光斑(克制) */
  background:
    radial-gradient(420px 420px at 18% 22%, var(--color-primary-soft), transparent 70%),
    radial-gradient(460px 460px at 82% 78%, var(--color-accent-soft), transparent 70%),
    var(--page-gradient);
}

.login__toggle {
  position: absolute;
  top: 20px;
  right: 20px;
}

.login__card {
  width: 360px;
  max-width: 92vw;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  box-shadow: var(--shadow-lg);
}

.login__title {
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(120deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.login__subtitle {
  margin: 8px 0 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.login__btn {
  width: 100%;
}
</style>
