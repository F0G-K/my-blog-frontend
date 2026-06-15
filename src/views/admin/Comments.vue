<script setup>
/**
 * 评论审核:待审 / 已通过 / 已拒绝列表 → 通过 / 拒绝 / 删除。
 */
import { ref, onMounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElTag,
  ElButton,
  ElRadioGroup,
  ElRadioButton,
  ElPagination,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import {
  getAdminComments,
  updateCommentStatus,
  deleteComment,
} from '@/api/comment'
import { formatDateTime } from '@/utils/format'

const STATUS_MAP = {
  pending: { label: '待审核', type: 'warning' },
  approved: { label: '已通过', type: 'success' },
  rejected: { label: '已拒绝', type: 'info' },
}

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = ref({ status: 'pending', page: 1, pageSize: 10 })

async function fetchList() {
  loading.value = true
  try {
    const params = { page: query.value.page, pageSize: query.value.pageSize }
    if (query.value.status) params.status = query.value.status
    const res = await getAdminComments(params)
    list.value = res?.list || []
    total.value = res?.total || 0
  } finally {
    loading.value = false
  }
}

function onStatusFilter() {
  query.value.page = 1
  fetchList()
}

async function review(row, status) {
  await updateCommentStatus(row.id, status)
  ElMessage.success(status === 'approved' ? '已通过' : '已拒绝')
  fetchList()
}

async function remove(row) {
  await ElMessageBox.confirm('确定删除该评论?', '提示', { type: 'warning' })
  await deleteComment(row.id)
  ElMessage.success('已删除')
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="comments">
    <div class="toolbar">
      <el-radio-group v-model="query.status" @change="onStatusFilter">
        <el-radio-button value="pending">待审核</el-radio-button>
        <el-radio-button value="approved">已通过</el-radio-button>
        <el-radio-button value="rejected">已拒绝</el-radio-button>
      </el-radio-group>
    </div>

    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="nickname" label="昵称" width="140" />
      <el-table-column prop="content" label="内容" min-width="240" show-overflow-tooltip />
      <el-table-column prop="articleTitle" label="所属文章" min-width="160" show-overflow-tooltip />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="STATUS_MAP[row.status]?.type" effect="plain">
            {{ STATUS_MAP[row.status]?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="160">
        <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status !== 'approved'" text type="success" size="small" @click="review(row, 'approved')">通过</el-button>
          <el-button v-if="row.status !== 'rejected'" text type="warning" size="small" @click="review(row, 'rejected')">拒绝</el-button>
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
  margin-bottom: 16px;
}

.pager {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
