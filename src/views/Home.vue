<script setup>
/**
 * 主页 / 标签页:文章列表(两种卡片) + 分页 + 右侧索引(最新文章 / 标签云)。
 * 路由 name === 'tag' 时按标签过滤(tagId 取自 query.id)。
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElPagination, ElSkeleton, ElEmpty } from 'element-plus'
import ArticleCard from '@/components/ArticleCard.vue'
import SideIndex from '@/components/SideIndex.vue'
import { getArticles } from '@/api/article'
import { getTags } from '@/api/tag'

const route = useRoute()

const loading = ref(false)
const list = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

const tags = ref([])
const latest = computed(() => list.value.slice(0, 5).map((a) => ({ id: a.id, title: a.title })))

const tagName = computed(() => (route.name === 'tag' ? route.params.name : ''))

async function fetchList() {
  loading.value = true
  try {
    const params = { page: page.value, pageSize: pageSize.value }
    if (route.name === 'tag' && route.query.id) params.tagId = route.query.id
    const res = await getArticles(params)
    list.value = res?.list || []
    total.value = res?.total || 0
  } catch {
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function fetchTags() {
  try {
    tags.value = await getTags()
  } catch {
    tags.value = []
  }
}

function onPageChange(p) {
  page.value = p
  fetchList()
}

// 标签切换时重置到第一页
watch(
  () => [route.name, route.query.id],
  () => {
    page.value = 1
    fetchList()
  },
)

onMounted(() => {
  fetchList()
  fetchTags()
})
</script>

<template>
  <div class="home page-grid">
    <div class="home__main">
      <h1 v-if="tagName" class="section-title">标签:{{ tagName }}</h1>

      <el-skeleton v-if="loading" :rows="4" animated class="home__skeleton" />

      <template v-else>
        <div v-if="list.length" class="home__list">
          <ArticleCard v-for="a in list" :key="a.id" :article="a" />
        </div>
        <el-empty v-else description="暂无文章" />

        <el-pagination
          v-if="total > pageSize"
          class="home__pager"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="onPageChange"
        />
      </template>
    </div>

    <SideIndex class="page-grid__aside" type="list" :latest="latest" :tags="tags" />
  </div>
</template>

<style scoped>
.home__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home__skeleton {
  padding: 20px;
  background: var(--bg-surface);
  border-radius: var(--radius-md);
}

.home__pager {
  margin-top: 24px;
  justify-content: center;
}
</style>
