<script setup>
/**
 * 分类管理:列表 + 新建 / 编辑 / 删除(对话框表单)。
 */
import { ref, reactive, onMounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/api/category'

const loading = ref(false)
const list = ref([])

const dialogVisible = ref(false)
const editingId = ref(null)
const form = reactive({ name: '' })

async function fetchList() {
  loading.value = true
  try {
    list.value = await getAdminCategories()
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.name = ''
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  form.name = row.name
  dialogVisible.value = true
}

async function submit() {
  if (!form.name.trim()) {
    ElMessage.warning('请填写分类名')
    return
  }
  const payload = { name: form.name.trim() }
  if (editingId.value) {
    await updateCategory(editingId.value, payload)
  } else {
    await createCategory(payload)
  }
  ElMessage.success('已保存')
  dialogVisible.value = false
  fetchList()
}

async function remove(row) {
  const extra = row.articleCount > 0 ? `,该分类下有 ${row.articleCount} 篇文章` : ''
  await ElMessageBox.confirm(`确定删除分类「${row.name}」?${extra}`, '提示', { type: 'warning' })
  await deleteCategory(row.id)
  ElMessage.success('已删除')
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="admin-categories">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate">新建分类</el-button>
    </div>

    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="name" label="分类名" min-width="200" />
      <el-table-column prop="articleCount" label="文章数" width="100" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button text type="danger" size="small" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑分类' : '新建分类'" width="420px">
      <el-form :model="form" label-width="64px" @submit.prevent>
        <el-form-item label="分类名">
          <el-input v-model="form.name" maxlength="50" placeholder="分类名" @keyup.enter="submit" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}
</style>
