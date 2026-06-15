<script setup>
/**
 * 开源项目管理:列表 + 新建 / 编辑 / 删除(对话框表单)。
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
  ElInputNumber,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/api/project'

const loading = ref(false)
const list = ref([])

const dialogVisible = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', description: '', techStack: '', githubUrl: '', sort: 0 })

async function fetchList() {
  loading.value = true
  try {
    list.value = await getAdminProjects()
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, { name: '', description: '', techStack: '', githubUrl: '', sort: 0 })
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    description: row.description,
    techStack: row.techStack,
    githubUrl: row.githubUrl,
    sort: row.sort ?? 0,
  })
  dialogVisible.value = true
}

async function submit() {
  if (!form.name.trim()) {
    ElMessage.warning('请填写项目名')
    return
  }
  const payload = { ...form }
  if (editingId.value) {
    await updateProject(editingId.value, payload)
  } else {
    await createProject(payload)
  }
  ElMessage.success('已保存')
  dialogVisible.value = false
  fetchList()
}

async function remove(row) {
  await ElMessageBox.confirm(`确定删除项目「${row.name}」?`, '提示', { type: 'warning' })
  await deleteProject(row.id)
  ElMessage.success('已删除')
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="admin-projects">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate">新建项目</el-button>
    </div>

    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="sort" label="排序" width="70" />
      <el-table-column prop="name" label="名称" width="160" />
      <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
      <el-table-column prop="techStack" label="技术栈" width="180" show-overflow-tooltip />
      <el-table-column prop="githubUrl" label="GitHub" min-width="200" show-overflow-tooltip />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button text type="danger" size="small" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑项目' : '新建项目'" width="480px">
      <el-form :model="form" label-width="72px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="技术栈"><el-input v-model="form.techStack" placeholder="逗号分隔,如 Vue, Spring Boot" /></el-form-item>
        <el-form-item label="GitHub"><el-input v-model="form.githubUrl" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
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
