<script setup>
/**
 * 开源项目:卡片列表,点击跳 GitHub。
 */
import { ref, onMounted } from 'vue'
import { ElSkeleton, ElEmpty, ElTag, ElIcon } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import { getProjects } from '@/api/project'

const loading = ref(false)
const projects = ref([])

onMounted(async () => {
  loading.value = true
  try {
    projects.value = await getProjects()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="projects">
    <h1 class="section-title">开源项目</h1>
    <el-skeleton v-if="loading" :rows="4" animated />
    <template v-else>
      <el-empty v-if="!projects.length" description="暂无项目" />
      <div class="project-grid">
        <a
          v-for="p in projects"
          :key="p.id"
          :href="p.githubUrl"
          target="_blank"
          rel="noopener"
          class="project-card"
        >
          <div class="project-card__head">
            <h3 class="project-card__name">{{ p.name }}</h3>
            <el-icon class="project-card__link"><Link /></el-icon>
          </div>
          <p class="project-card__desc line-clamp-3">{{ p.description }}</p>
          <div class="project-card__tech">
            <el-tag
              v-for="tech in (p.techStack || '').split(/[,，\s]+/).filter(Boolean)"
              :key="tech"
              size="small"
              effect="plain"
            >
              {{ tech }}
            </el-tag>
          </div>
        </a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  display: block;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.project-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.project-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-card__name {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.project-card__link {
  color: var(--text-secondary);
}

.project-card__desc {
  margin: 10px 0 14px;
  font-size: 14px;
  color: var(--text-regular);
  min-height: 42px;
}

.project-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
