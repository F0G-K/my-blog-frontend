<script setup>
/**
 * 文章详情:Markdown 渲染(markdown-it + highlight.js,DOMPurify 净化)+ TOC + 评论。
 * 移动端 TOC 改为右下角浮动按钮 → 弹出抽屉。
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import {
  ElSkeleton,
  ElTag,
  ElIcon,
  ElButton,
  ElDrawer,
  ElInput,
  ElForm,
  ElFormItem,
  ElMessage,
} from 'element-plus'
import { View, Calendar, List, Refresh } from '@element-plus/icons-vue'
import SideIndex from '@/components/SideIndex.vue'
import CommentList from '@/components/CommentList.vue'
import { getArticleDetail } from '@/api/article'
import { getArticleComments, submitComment } from '@/api/comment'
import { renderWithToc } from '@/utils/markdown'
import { formatDate } from '@/utils/format'
import { useBreakpoint } from '@/composables/useBreakpoint'

const route = useRoute()
const { isMobile } = useBreakpoint()

const loading = ref(false)
const article = ref(null)
const html = ref('')
const toc = ref([])
const activeId = ref('')

const comments = ref([])
const tocDrawer = ref(false)

// 评论表单
const replyTo = ref(null)
const form = ref({ nickname: '', content: '' })

const articleId = computed(() => route.params.id)

async function fetchArticle() {
  loading.value = true
  try {
    article.value = await getArticleDetail(articleId.value)
    const rendered = renderWithToc(article.value?.content || '')
    html.value = rendered.html
    toc.value = rendered.toc
    await nextTick()
    setupScrollSpy()
  } finally {
    loading.value = false
  }
}

async function fetchComments() {
  try {
    comments.value = await getArticleComments(articleId.value)
  } catch {
    comments.value = []
  }
}

function onReply(comment) {
  replyTo.value = comment
  document.querySelector('.comment-form')?.scrollIntoView({ behavior: 'smooth' })
}

function cancelReply() {
  replyTo.value = null
}

async function postComment() {
  if (!form.value.nickname.trim() || !form.value.content.trim()) {
    ElMessage.warning('昵称和内容不能为空')
    return
  }
  await submitComment({
    articleId: Number(articleId.value),
    parentId: replyTo.value?.id ?? null,
    nickname: form.value.nickname.trim(),
    email: '',
    content: form.value.content.trim(),
  })
  ElMessage.success('评论已提交,待审核')
  form.value.content = ''
  replyTo.value = null
}

function genRandomNickname() {
  form.value.nickname = `游客_${Math.random().toString(36).slice(2, 6)}`
}

/* ---- 滚动监听高亮当前章节 ---- */
let observer = null
function setupScrollSpy() {
  observer?.disconnect()
  if (!toc.value.length) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) activeId.value = e.target.id
      }
    },
    { rootMargin: '-80px 0px -70% 0px' },
  )
  toc.value.forEach((t) => {
    const el = document.getElementById(t.id)
    if (el) observer.observe(el)
  })
}

watch(articleId, () => {
  fetchArticle()
  fetchComments()
})

onMounted(() => {
  fetchArticle()
  fetchComments()
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="detail page-grid">
    <div class="detail__main">
      <el-skeleton v-if="loading" :rows="8" animated />

      <template v-else-if="article">
        <article class="detail__article">
          <h1 class="detail__title">{{ article.title }}</h1>
          <div class="detail__meta">
            <span v-if="article.categoryName" class="meta-cat">{{ article.categoryName }}</span>
            <span class="meta-item"><el-icon><Calendar /></el-icon> {{ formatDate(article.publishedAt) }}</span>
            <span class="meta-item"><el-icon><View /></el-icon> {{ article.viewCount ?? 0 }}</span>
          </div>
          <div class="detail__tags">
            <el-tag v-for="t in article.tags || []" :key="t" size="small" effect="plain">{{ t }}</el-tag>
          </div>

          <!-- 渲染后的安全 HTML -->
          <div class="markdown-body detail__content" v-html="html" />
        </article>

        <!-- 评论区 -->
        <section class="detail__comments">
          <h2 class="section-title">评论</h2>

          <el-form class="comment-form" @submit.prevent>
            <div v-if="replyTo" class="comment-form__reply-tip">
              回复 @{{ replyTo.nickname }}
              <el-button text size="small" @click="cancelReply">取消</el-button>
            </div>
            <el-form-item>
              <div class="comment-form__nick">
                <el-input v-model="form.nickname" placeholder="昵称" maxlength="20" />
                <el-button :icon="Refresh" @click="genRandomNickname">随机</el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="form.content"
                type="textarea"
                :rows="3"
                maxlength="500"
                show-word-limit
                placeholder="友善的评论是交流的起点…"
              />
            </el-form-item>
            <el-button type="primary" @click="postComment">提交评论</el-button>
          </el-form>

          <CommentList :comments="comments" class="detail__comment-list" @reply="onReply" />
        </section>
      </template>

      <el-empty v-else description="文章不存在" />
    </div>

    <!-- 右侧 TOC(桌面 / 平板) -->
    <SideIndex
      v-if="!isMobile"
      class="page-grid__aside"
      type="toc"
      :toc="toc"
      :active-id="activeId"
    />

    <!-- 移动端:浮动按钮弹出目录 -->
    <button v-if="isMobile && toc.length" class="toc-fab" @click="tocDrawer = true">
      <el-icon :size="20"><List /></el-icon>
    </button>
    <el-drawer v-model="tocDrawer" title="目录" direction="btt" size="50%">
      <SideIndex type="toc" :toc="toc" :active-id="activeId" />
    </el-drawer>
  </div>
</template>

<style scoped>
.detail__article {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 32px;
}

.detail__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 14px 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.detail__meta .meta-cat {
  color: var(--color-primary);
  font-weight: 600;
}

.detail__meta .meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.detail__tags {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.detail__content {
  margin-top: 8px;
}

.detail__comments {
  margin-top: 24px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
}

.comment-form {
  margin-bottom: 28px;
}

.comment-form__reply-tip {
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--color-primary);
}

.comment-form__nick {
  display: flex;
  gap: 8px;
  max-width: 320px;
}

.detail__comment-list {
  margin-top: 8px;
}

.toc-fab {
  position: fixed;
  right: 16px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: #fff;
  box-shadow: var(--shadow-lg);
  z-index: 50;
}

@media (max-width: 767px) {
  .detail__article {
    padding: 20px;
  }
  .detail__title {
    font-size: 22px;
  }
}
</style>
