<script setup>
/**
 * 搜索:调 /api/search,展示高亮结果。移动端搜索框全屏(此处简化为顶部全宽)。
 * highlight 字段含命中片段(标题 / 正文),用 .search-highlight 渲染。
 */
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElInput, ElSkeleton, ElEmpty, ElPagination } from 'element-plus'
import { Search as SearchIcon } from '@element-plus/icons-vue'
import { search } from '@/api/search'
import { sanitizeHtml } from '@/utils/markdown'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const keyword = ref(route.query.keyword || '')
const loading = ref(false)
const list = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searched = ref(false)

async function doSearch() {
  const kw = String(keyword.value).trim()
  if (!kw) return
  // 同步到地址栏
  router.replace({ name: 'search', query: { keyword: kw } })
  loading.value = true
  searched.value = true
  try {
    const res = await search({ keyword: kw, page: page.value, pageSize: pageSize.value })
    list.value = res?.list || []
    total.value = res?.total || 0
  } finally {
    loading.value = false
  }
}

function onPageChange(p) {
  page.value = p
  doSearch()
}

function goArticle(id) {
  router.push({ name: 'article', params: { id } })
}

// 高亮:优先用后端返回的 highlight 片段,否则回退原字段
function titleHtml(item) {
  return sanitizeHtml(item.highlight?.title || item.title || '')
}
function snippetHtml(item) {
  return sanitizeHtml(item.highlight?.content || item.summary || '')
}

watch(
  () => route.query.keyword,
  (kw) => {
    keyword.value = kw || ''
    page.value = 1
    if (kw) doSearch()
  },
)

onMounted(() => {
  if (keyword.value) doSearch()
})
</script>

<template>
  <div class="search">
    <div class="search__bar">
      <el-input
        v-model="keyword"
        size="large"
        placeholder="搜索标题、正文、标签…"
        :prefix-icon="SearchIcon"
        clearable
        @keyup.enter="page = 1; doSearch()"
      />
    </div>

    <el-skeleton v-if="loading" :rows="4" animated />

    <template v-else-if="searched">
      <p class="search__count">共找到 {{ total }} 条结果</p>
      <el-empty v-if="!list.length" description="没有匹配的文章" />
      <ul class="search__list">
        <li v-for="item in list" :key="item.id" class="search-item" @click="goArticle(item.id)">
          <h3 class="search-item__title search-highlight" v-html="titleHtml(item)" />
          <p class="search-item__snippet search-highlight line-clamp-2" v-html="snippetHtml(item)" />
          <div class="search-item__meta">
            <span v-if="item.categoryName">{{ item.categoryName }}</span>
            <span>{{ formatDate(item.publishedAt) }}</span>
          </div>
        </li>
      </ul>

      <el-pagination
        v-if="total > pageSize"
        class="search__pager"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="onPageChange"
      />
    </template>

    <el-empty v-else description="输入关键词开始搜索" />
  </div>
</template>

<style scoped>
.search__bar {
  margin-bottom: 24px;
}

.search__count {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 16px;
}

.search__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.search-item {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.search-item:hover {
  box-shadow: var(--shadow-md);
}

.search-item__title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.search-item__snippet {
  margin: 8px 0;
  font-size: 14px;
  color: var(--text-regular);
}

.search-item__meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.search__pager {
  margin-top: 24px;
  justify-content: center;
}
</style>
