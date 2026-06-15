<script setup>
/**
 * 归档:时间线按年 / 月分组,分页。
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElPagination, ElSkeleton, ElEmpty } from 'element-plus'
import { getArchives } from '@/api/archive'
import { formatDate } from '@/utils/format'

const router = useRouter()
const loading = ref(false)
const list = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

// 按 年 → 月 分组
const grouped = computed(() => {
  const groups = {}
  for (const item of list.value) {
    const d = new Date(item.publishedAt)
    const year = d.getFullYear()
    groups[year] = groups[year] || []
    groups[year].push(item)
  }
  return Object.keys(groups)
    .sort((a, b) => b - a)
    .map((year) => ({ year, items: groups[year] }))
})

async function fetchData() {
  loading.value = true
  try {
    const res = await getArchives({ page: page.value, pageSize: pageSize.value })
    list.value = res?.list || []
    total.value = res?.total || 0
  } finally {
    loading.value = false
  }
}

function onPageChange(p) {
  page.value = p
  fetchData()
}

function goArticle(id) {
  router.push({ name: 'article', params: { id } })
}

onMounted(fetchData)
</script>

<template>
  <div class="archive">
    <h1 class="section-title">归档</h1>
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <el-empty v-if="!list.length" description="暂无文章" />
      <div v-for="group in grouped" :key="group.year" class="archive__year">
        <h2 class="archive__year-title">{{ group.year }}</h2>
        <ul class="timeline">
          <li v-for="item in group.items" :key="item.id" class="timeline__item" @click="goArticle(item.id)">
            <span class="timeline__date">{{ formatDate(item.publishedAt).slice(5) }}</span>
            <span class="timeline__title">{{ item.title }}</span>
          </li>
        </ul>
      </div>

      <el-pagination
        v-if="total > pageSize"
        class="archive__pager"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="onPageChange"
      />
    </template>
  </div>
</template>

<style scoped>
.archive__year {
  margin-bottom: 28px;
}

.archive__year-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.timeline {
  border-left: 2px solid var(--border-color);
  padding-left: 20px;
}

.timeline__item {
  position: relative;
  display: flex;
  gap: 14px;
  align-items: baseline;
  padding: 8px 0;
  cursor: pointer;
}

.timeline__item::before {
  content: '';
  position: absolute;
  left: -26px;
  top: 14px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
}

.timeline__date {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.timeline__title {
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.timeline__item:hover .timeline__title {
  color: var(--color-primary);
}

.archive__pager {
  margin-top: 24px;
  justify-content: center;
}
</style>
