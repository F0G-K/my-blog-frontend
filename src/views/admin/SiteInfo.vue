<script setup>
/**
 * 站点信息编辑:维护昵称 / 简介 / 关于页正文 / 邮箱 / 社交链接等。
 * 关于页正文用 md-editor-v3 编辑。
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElDivider,
} from 'element-plus'
import { getAdminSiteInfo, updateSiteInfo } from '@/api/site'
import { uploadImage } from '@/api/admin'
import { useThemeStore } from '@/store/theme'
import { useSiteStore } from '@/store/site'

const theme = useThemeStore()
const siteStore = useSiteStore()
const editorTheme = computed(() => (theme.isDark ? 'dark' : 'light'))

const loading = ref(false)
const saving = ref(false)
const form = reactive({
  nickname: '',
  avatarUrl: '',
  bio: '',
  aboutContent: '',
  email: '',
  wechat: '',
  wechatQrUrl: '',
  githubUrl: '',
  rssUrl: '',
  location: '',
  job: '',
})

async function load() {
  loading.value = true
  try {
    const data = await getAdminSiteInfo()
    Object.assign(form, data || {})
  } finally {
    loading.value = false
  }
}

async function onUploadImg(files, callback) {
  try {
    const urls = await Promise.all(files.map((f) => uploadImage(f)))
    callback(urls.map((u) => u.url))
  } catch {
    ElMessage.error('图片上传失败')
  }
}

async function save() {
  saving.value = true
  try {
    await updateSiteInfo({ ...form })
    ElMessage.success('已保存')
    siteStore.load(true) // 刷新全站共享的站点信息
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="site-info" v-loading="loading">
    <el-form :model="form" label-width="96px" class="site-info__form">
      <el-divider content-position="left">基础信息(左栏)</el-divider>
      <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
      <el-form-item label="头像 URL"><el-input v-model="form.avatarUrl" /></el-form-item>
      <el-form-item label="一句话简介"><el-input v-model="form.bio" /></el-form-item>

      <el-divider content-position="left">社交链接</el-divider>
      <el-form-item label="GitHub"><el-input v-model="form.githubUrl" /></el-form-item>
      <el-form-item label="微信"><el-input v-model="form.wechat" /></el-form-item>
      <el-form-item label="RSS"><el-input v-model="form.rssUrl" /></el-form-item>

      <el-divider content-position="left">关于页</el-divider>
      <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
      <el-form-item label="城市"><el-input v-model="form.location" /></el-form-item>
      <el-form-item label="职位"><el-input v-model="form.job" /></el-form-item>
      <el-form-item label="公众号二维码"><el-input v-model="form.wechatQrUrl" /></el-form-item>
      <el-form-item label="关于页正文">
        <MdEditor
          v-model="form.aboutContent"
          :theme="editorTheme"
          style="height: 360px"
          @on-upload-img="onUploadImg"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.site-info__form {
  max-width: 760px;
}
</style>
