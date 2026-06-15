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
  ElMessage,
} from 'element-plus'
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
        <el-input v-model="form.coverUrl" placeholder="封面图 URL(留空则为文字卡片)" clearable />
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
</style>
