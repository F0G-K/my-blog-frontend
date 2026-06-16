<script setup>
/**
 * 标签管理:列表 + 新建 + 删除(标签无更新接口)。
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
import { getAdminTags, createTag, deleteTag } from '@/api/tag'

const loading = ref(false)
const list = ref([])

const dialogVisible = ref(false)
const form = reactive({ name: '' })

async function fetchList() {
  loading.value = true
  try {
    list.value = await getAdminTags()
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.name = ''
  dialogVisible.value = true
}

async function submit() {
  if (!form.name.trim()) {
    ElMessage.warning('请填写标签名')
    return
  }
  await createTag({ name: form.name.trim() })
  ElMessage.success('已添加')
  dialogVisible.value = false
  fetchList()
}

async function remove(row) {
  const extra = row.articleCount > 0 ? `,该标签下有 ${row.articleCount} 篇文章` : ''
  await ElMessageBox.confirm(`确定删除标签「${row.name}」?${extra}`, '提示', { type: 'warning' })
  await deleteTag(row.id)
  ElMessage.success('已删除')
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="admin-tags">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate">新建标签</el-button>
    </div>

    <el-table v-loading="loading" :data="list" stripe>
      <el-table-column prop="name" label="标签名" min-width="200" />
      <el-table-column prop="articleCount" label="文章数" width="100" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button text type="danger" size="small" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="新建标签" width="420px">
      <el-form :model="form" label-width="64px" @submit.prevent>
        <el-form-item label="标签名">
          <el-input v-model="form.name" maxlength="50" placeholder="标签名" @keyup.enter="submit" />
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
