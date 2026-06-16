<script setup>
/**
 * 右侧索引面板。两种用途由 type 决定:
 *  - type="list"(列表页):展示最新文章 / 标签云
 *  - type="toc"(详情页):展示文章目录,移动端由详情页改为浮动按钮弹出
 */
import { useRouter } from 'vue-router'

const props = defineProps({
  type: { type: String, default: 'list' }, // 'list' | 'toc'
  latest: { type: Array, default: () => [] }, // [{ id, title }]
  tags: { type: Array, default: () => [] }, // [{ id, name, articleCount }]
  toc: { type: Array, default: () => [] }, // [{ id, text, level }]
  activeId: { type: String, default: '' },
})

const router = useRouter()

function goArticle(id) {
  router.push({ name: 'article', params: { id } })
}

function goTag(tag) {
  router.push({ name: 'tag', params: { name: tag.name }, query: { id: tag.id } })
}
</script>

<template>
  <aside class="side-index">
    <!-- 目录(详情页) -->
    <template v-if="type === 'toc'">
      <div class="side-block">
        <h4 class="side-block__title">目录</h4>
        <ul v-if="toc.length" class="toc">
          <li
            v-for="item in toc"
            :key="item.id"
            class="toc__item"
            :class="[`toc__item--l${item.level}`, { 'is-active': item.id === activeId }]"
          >
            <a :href="`#${item.id}`">{{ item.text }}</a>
          </li>
        </ul>
        <p v-else class="side-empty">暂无目录</p>
      </div>
    </template>

    <!-- 列表页:最新文章 + 标签云 -->
    <template v-else>
      <div class="side-block">
        <h4 class="side-block__title">最新文章</h4>
        <ul class="latest" v-if="latest.length">
          <li v-for="a in latest" :key="a.id" @click="goArticle(a.id)">
            {{ a.title }}
          </li>
        </ul>
        <p v-else class="side-empty">暂无文章</p>
      </div>

      <div class="side-block">
        <h4 class="side-block__title">标签云</h4>
        <div class="tag-cloud" v-if="tags.length">
          <span v-for="t in tags" :key="t.id" class="tag-cloud__item" @click="goTag(t)">
            {{ t.name }}
            <em>{{ t.articleCount }}</em>
          </span>
        </div>
        <p v-else class="side-empty">暂无标签</p>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.side-index {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-block {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.side-block__title {
  position: relative;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  padding-left: 12px;
}

.side-block__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 4px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
}

.side-empty {
  font-size: 13px;
  color: var(--text-placeholder);
}

.latest li {
  font-size: 14px;
  color: var(--text-regular);
  padding: 6px 0;
  cursor: pointer;
  transition:
    color var(--dur-fast) var(--ease-soft),
    padding-left var(--dur-fast) var(--ease-soft);
}

.latest li:hover {
  color: var(--color-primary);
  padding-left: 4px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-cloud__item {
  font-size: 13px;
  color: var(--text-regular);
  background: var(--bg-surface-2);
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background var(--dur-fast) var(--ease-soft),
    color var(--dur-fast) var(--ease-soft),
    transform var(--dur-fast) var(--ease-soft);
}

.tag-cloud__item:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  transform: translateY(-2px);
}

.tag-cloud__item em {
  font-style: normal;
  color: var(--text-placeholder);
  margin-left: 2px;
}

.toc__item {
  padding: 4px 0;
}

.toc__item a {
  font-size: 13px;
  color: var(--text-regular);
}

.toc__item.is-active a {
  color: var(--color-primary);
  font-weight: 600;
}

.toc__item--l2 {
  padding-left: 12px;
}

.toc__item--l3 {
  padding-left: 24px;
}
</style>
