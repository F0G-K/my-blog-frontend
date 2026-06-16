<script setup>
/**
 * 文章写作 / 编辑:md-editor-v3 实时预览 + 草稿自动保存(防抖)+ 图片上传。
 * 设置封面 / 分类 / 标签 / 摘要 / 状态。
 */
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElUpload,
  ElIcon,
  ElMessage,
} from 'element-plus'
import { UploadFilled, Delete } from '@element-plus/icons-vue'
import {
  getAdminArticleDetail,
  createArticle,
  updateArticle,
  autosaveArticle,
} from '@/api/article'
import { getAdminCategories } from '@/api/category'
import { getAdminTags } from '@/api/tag'
import { uploadImage } from '@/api/admin'
import { useThemeStore } from '@/store/theme'

const route = useRoute()
const router = useRouter()
const theme = useThemeStore()
const editorTheme = computed(() => (theme.isDark ? 'dark' : 'light'))

const form = reactive({
  id: route.params.id ? Number(route.params.id) : null,
  title: '',
  summary: '',
  content: '',
  coverUrl: '',
  categoryId: null,
  tagIds: [],
  status: 'draft',
})

const categories = ref([])
const tags = ref([])
const saving = ref(false)
const autosaveTip = ref('')

const isEdit = computed(() => !!form.id)

async function loadMeta() {
  ;[categories.value, tags.value] = await Promise.all([
    getAdminCategories().catch(() => []),
    getAdminTags().catch(() => []),
  ])
}

async function loadArticle() {
  if (!route.params.id) return
  const data = await getAdminArticleDetail(route.params.id)
  Object.assign(form, {
    id: data.id,
    title: data.title || '',
    summary: data.summary || '',
    content: data.content || '',
    coverUrl: data.coverUrl || '',
    categoryId: data.categoryId ?? null,
    tagIds: data.tagIds || [],
    status: data.status || 'draft',
  })
}

function buildPayload() {
  return {
    id: form.id ?? undefined,
    title: form.title,
    summary: form.summary,
    content: form.content,
    coverUrl: form.coverUrl || null,
    categoryId: form.categoryId,
    tagIds: form.tagIds,
    status: form.status,
  }
}

/* ---- 草稿自动保存(防抖 1.5s)---- */
let autosaveTimer = null
let dirty = false

function scheduleAutosave() {
  dirty = true
  clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(runAutosave, 1500)
}

async function runAutosave() {
  if (!dirty || !form.title.trim()) return
  try {
    const res = await autosaveArticle(buildPayload())
    if (res?.id && !form.id) form.id = res.id
    dirty = false
    autosaveTip.value = `已自动保存草稿 ${new Date().toLocaleTimeString()}`
  } catch {
    /* 自动保存失败静默,等待下次 */
  }
}

watch(() => [form.title, form.content, form.summary, form.coverUrl, form.categoryId, form.tagIds, form.status], scheduleAutosave, { deep: true })

/* ---- 图片上传钩子(md-editor-v3)---- */
async function onUploadImg(files, callback) {
  try {
    const urls = await Promise.all(files.map((f) => uploadImage(f)))
    callback(urls.map((u) => u.url))
  } catch {
    ElMessage.error('图片上传失败')
  }
}

/* ---- 封面上传(拖拽 + 按钮)---- */
function beforeCover(file) {
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('只能上传图片')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('封面不能超过 5MB')
    return false
  }
  return true
}

async function doCoverUpload(option) {
  try {
    const res = await uploadImage(option.file)
    form.coverUrl = res.url
    ElMessage.success('封面已上传')
    option.onSuccess?.(res)
  } catch (e) {
    ElMessage.error('封面上传失败')
    option.onError?.(e)
  }
}

function removeCover() {
  form.coverUrl = ''
}

/* ---- 手动保存 / 发布 ---- */
async function save(status) {
  if (!form.title.trim()) {
    ElMessage.warning('请填写标题')
    return
  }
  saving.value = true
  form.status = status
  try {
    const payload = buildPayload()
    if (isEdit.value) {
      await updateArticle(form.id, payload)
    } else {
      const res = await createArticle(payload)
      form.id = res?.id ?? form.id
    }
    ElMessage.success(status === 'published' ? '已发布' : '已保存草稿')
    router.push({ name: 'admin-articles' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadMeta()
  await loadArticle()
})

onBeforeUnmount(() => clearTimeout(autosaveTimer))
</script>

<template>
  <div class="article-edit">
    <el-form label-width="64px" class="article-edit__meta">
      <div class="meta-row">
        <el-form-item label="标题" class="meta-row__title">
          <el-input v-model="form.title" placeholder="文章标题" maxlength="100" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 120px">
            <el-option label="草稿" value="draft" />
            <el-option label="发布" value="published" />
          </el-select>
        </el-form-item>
      </div>
      <div class="meta-row">
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="选择分类" clearable style="width: 180px">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" class="meta-row__tags">
          <el-select
            v-model="form.tagIds"
            multiple
            filterable
            placeholder="选择标签"
            style="width: 100%"
          >
            <el-option v-for="t in tags" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="封面">
        <div class="cover-field">
          <div v-if="form.coverUrl" class="cover-preview">
            <img :src="form.coverUrl" alt="封面预览" />
            <el-button size="small" :icon="Delete" @click="removeCover">移除</el-button>
          </div>
          <el-upload
            drag
            :show-file-list="false"
            accept="image/*"
            :before-upload="beforeCover"
            :http-request="doCoverUpload"
            class="cover-upload"
          >
            <el-icon class="cover-upload__icon"><UploadFilled /></el-icon>
            <div class="cover-upload__text">将图片拖到此处</div>
            <el-button type="primary" size="small" class="cover-upload__btn">上传封面</el-button>
            <template #tip>
              <div class="cover-upload__tip">留空则为文字卡片;支持 ≤5MB 图片</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.summary" type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="文字卡片摘要" />
      </el-form-item>
    </el-form>

    <MdEditor
      v-model="form.content"
      :theme="editorTheme"
      style="height: 60vh"
      @on-upload-img="onUploadImg"
    />

    <div class="article-edit__footer">
      <span class="autosave-tip">{{ autosaveTip }}</span>
      <div class="article-edit__actions">
        <el-button @click="save('draft')" :loading="saving">存为草稿</el-button>
        <el-button type="primary" @click="save('published')" :loading="saving">发布</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-edit__meta {
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-row__title {
  flex: 1;
  min-width: 240px;
}

.meta-row__tags {
  flex: 1;
  min-width: 240px;
}

.article-edit__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.autosave-tip {
  font-size: 13px;
  color: var(--text-placeholder);
}

.article-edit__actions {
  display: flex;
  gap: 8px;
}

.cover-field {
  width: 100%;
}

.cover-preview {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.cover-preview img {
  width: 160px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.cover-upload__icon {
  font-size: 28px;
  color: var(--text-placeholder);
}

.cover-upload__text {
  font-size: 13px;
  color: var(--text-regular);
  margin: 4px 0 8px;
}

.cover-upload__tip {
  font-size: 12px;
  color: var(--text-placeholder);
}
</style>
