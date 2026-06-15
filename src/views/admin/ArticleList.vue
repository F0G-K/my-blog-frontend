<script setup>
/**
 * 文章管理:列表(含草稿)+ 状态筛选 + 关键词 + 发布/下架/编辑/删除。
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElTable,
  ElTableColumn,
  ElTag,
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElPagination,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import {
  getAdminArticles,
  updateArticleStatus,
  deleteArticle,
} from '@/api/article'
import { formatDateTime } from '@/utils/format'

const router = useRouter()

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = ref({ status: '', keyword: '', page: 1, pageSize: 10 })

async function fetchList() {
  loading.value = true
  try {
    const params = { page: query.value.page, pageSize: query.value.pageSize }
    if (query.value.status) params.status = query.value.status
    if (query.value.keyword) params.keyword = query.value.keyword
    const res = await getAdminArticles(params)
    list.value = res?.list || []
    total.value = res?.total || 0
  } finally {
    loading.value = false
  }
}

function search() {
  query.value.page = 1
  fetchList()
}

function toEdit(id) {
  router.push(id ? { name: 'admin-article-edit', params: { id } } : { name: 'admin-article-edit' })
}

async function toggleStatus(row) {
  const next = row.status === 'published' ? 'draft' : 'published'
  await updateArticleStatus(row.id, next)
  ElMessage.success(next === 'published' ? '已发布' : '已下架')
  fetchList()
}

async function remove(row) {
  await ElMessageBox.confirm(`确定删除《${row.title}》?`, '提示', { type: 'warning' })
  await deleteArticle(row.id)
  ElMessage.success('已删除')
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="article-list">
    <div class="toolbar">
      <el-button type="primary" @click="toEdit()">写文章</el-button>
      <div class="toolbar__filters">
        <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 130px" @change="search">
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
        <el-input
          v-model="query.keyword"
          placeholder="搜索标题"
          clearable
          style="width: 200px"
          @keyup.enter="search"
          @clear="search"
        />
        <el-button @click="search">搜索</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="分类" width="120" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="plain">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="阅读" width="80" />
      <el-table-column label="更新时间" width="160">
        <template #default="{ row }">{{ formatDateTime(row.updatedAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click="toEdit(row.id)">编辑</el-button>
          <el-button text size="small" @click="toggleStatus(row)">
            {{ row.status === 'published' ? '下架' : '发布' }}
          </el-button>
          <el-button text type="danger" size="small" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > query.pageSize"
      class="pager"
      background
      layout="prev, pager, next, total"
      :total="total"
      :page-size="query.pageSize"
      :current-page="query.page"
      @current-change="(p) => { query.page = p; fetchList() }"
    />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.toolbar__filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pager {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
