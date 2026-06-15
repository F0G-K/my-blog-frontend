<script setup>
/**
 * 技术分类:分类列表 + 标签云(均带文章数)。点标签进 /tag/:name。
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElSkeleton, ElEmpty } from 'element-plus'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'

const router = useRouter()
const loading = ref(false)
const categories = ref([])
const tags = ref([])

function goTag(tag) {
  router.push({ name: 'tag', params: { name: tag.name }, query: { id: tag.id } })
}

onMounted(async () => {
  loading.value = true
  try {
    ;[categories.value, tags.value] = await Promise.all([getCategories(), getTags()])
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="category">
    <h1 class="section-title">技术分类</h1>
    <el-skeleton v-if="loading" :rows="4" animated />
    <template v-else>
      <div class="cat-grid">
        <div
          v-for="c in categories"
          :key="c.id"
          class="cat-item"
        >
          <span class="cat-item__name">{{ c.name }}</span>
          <span class="cat-item__count">{{ c.articleCount }} 篇</span>
        </div>
        <el-empty v-if="!categories.length" description="暂无分类" />
      </div>

      <h2 class="section-title category__sub">标签云</h2>
      <div class="tag-cloud">
        <span v-for="t in tags" :key="t.id" class="tag-cloud__item" @click="goTag(t)">
          {{ t.name }} <em>{{ t.articleCount }}</em>
        </span>
        <el-empty v-if="!tags.length" description="暂无标签" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.category__sub {
  margin-top: 32px;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.cat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: box-shadow 0.2s ease;
}

.cat-item:hover {
  box-shadow: var(--shadow-md);
}

.cat-item__name {
  font-weight: 600;
  color: var(--text-primary);
}

.cat-item__count {
  font-size: 13px;
  color: var(--text-secondary);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-cloud__item {
  font-size: 14px;
  color: var(--text-regular);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-cloud__item:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.tag-cloud__item em {
  font-style: normal;
  color: var(--text-placeholder);
}
</style>
