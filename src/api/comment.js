import request from '@/utils/request'

/* ============ 公开接口 ============ */

/** 某文章的已审核评论(顶级嵌套二级 replies)→ CommentVO[] */
export function getArticleComments(articleId) {
  return request.get(`/articles/${articleId}/comments`)
}

/**
 * 提交评论(提交后状态为待审核)
 * @param {{ articleId: number, parentId?: number|null, nickname: string, email?: string, content: string }} data
 */
export function submitComment(data) {
  return request.post('/comments', data)
}

/* ============ 管理接口(需登录) ============ */

/**
 * 评论审核列表
 * @param {{ status?: 'pending'|'approved'|'rejected', page?: number, pageSize?: number }} params
 */
export function getAdminComments(params) {
  return request.get('/admin/comments', { params })
}

/** 审核评论(通过 / 拒绝) */
export function updateCommentStatus(id, status) {
  return request.patch(`/admin/comments/${id}/status`, { status })
}

/** 删除评论 */
export function deleteComment(id) {
  return request.delete(`/admin/comments/${id}`)
}
