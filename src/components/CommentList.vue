<script setup>
/**
 * 评论列表:两级嵌套展示(顶级评论 + 其 replies)。
 * 内容渲染前经 XSS 净化。回复按钮通过 reply 事件冒泡给父组件处理。
 */
import { ElAvatar } from 'element-plus'
import { fromNow } from '@/utils/format'
import { sanitizeHtml } from '@/utils/markdown'

defineProps({
  comments: { type: Array, default: () => [] },
})
const emit = defineEmits(['reply'])
</script>

<template>
  <ul class="comment-list">
    <li v-for="c in comments" :key="c.id" class="comment">
      <el-avatar :size="36" class="comment__avatar">{{ c.nickname?.[0] || '游' }}</el-avatar>
      <div class="comment__body">
        <div class="comment__head">
          <span class="comment__name">{{ c.nickname }}</span>
          <span class="comment__time">{{ fromNow(c.createdAt) }}</span>
        </div>
        <div class="comment__content" v-html="sanitizeHtml(c.content)" />
        <button class="comment__reply" @click="emit('reply', c)">回复</button>

        <!-- 二级回复 -->
        <ul v-if="c.replies && c.replies.length" class="comment__replies">
          <li v-for="r in c.replies" :key="r.id" class="comment comment--reply">
            <el-avatar :size="30" class="comment__avatar">{{ r.nickname?.[0] || '游' }}</el-avatar>
            <div class="comment__body">
              <div class="comment__head">
                <span class="comment__name">{{ r.nickname }}</span>
                <span class="comment__time">{{ fromNow(r.createdAt) }}</span>
              </div>
              <div class="comment__content" v-html="sanitizeHtml(r.content)" />
            </div>
          </li>
        </ul>
      </div>
    </li>

    <li v-if="!comments.length" class="comment-empty">还没有评论,来抢沙发吧~</li>
  </ul>
</template>

<style scoped>
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment {
  display: flex;
  gap: 12px;
}

.comment__avatar {
  flex-shrink: 0;
  background: var(--color-primary);
  color: #fff;
}

.comment__body {
  flex: 1;
  min-width: 0;
}

.comment__head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.comment__name {
  font-weight: 600;
  color: var(--text-primary);
}

.comment__time {
  font-size: 12px;
  color: var(--text-placeholder);
}

.comment__content {
  margin: 6px 0;
  color: var(--text-regular);
  font-size: 14px;
  word-break: break-word;
}

.comment__reply {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 0;
}

.comment__reply:hover {
  color: var(--color-primary);
}

.comment__replies {
  margin-top: 14px;
  padding-left: 12px;
  border-left: 2px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.comment-empty {
  text-align: center;
  color: var(--text-placeholder);
  padding: 24px 0;
}
</style>
