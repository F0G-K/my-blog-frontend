import request from '@/utils/request'

/* ============ 公开接口 ============ */

/**
 * 文章列表(仅已发布,publishedAt 倒序)
 * @param {{ page?: number, pageSize?: number, categoryId?: number, tagId?: number }} params
 * @returns PageResult<ArticleListItem>
 */
export function getArticles(params) {
  return request.get('/articles', { params })
}

/** 文章详情(阅读量 +1)→ ArticleDetail */
export function getArticleDetail(id) {
  return request.get(`/articles/${id}`)
}

/* ============ 管理接口(需登录) ============ */

/**
 * 管理端文章列表(含草稿)
 * @param {{ status?: 'draft'|'published', keyword?: string, page?: number, pageSize?: number }} params
 */
export function getAdminArticles(params) {
  return request.get('/admin/articles', { params })
}

/** 管理端文章详情(回填表单) */
export function getAdminArticleDetail(id) {
  return request.get(`/admin/articles/${id}`)
}

/** 新建文章 → { id } */
export function createArticle(data) {
  return request.post('/admin/articles', data)
}

/** 更新文章 */
export function updateArticle(id, data) {
  return request.put(`/admin/articles/${id}`, data)
}

/** 草稿自动保存(可含 id)→ { id } */
export function autosaveArticle(data) {
  return request.post('/admin/articles/autosave', data)
}

/** 发布 / 下架 */
export function updateArticleStatus(id, status) {
  return request.patch(`/admin/articles/${id}/status`, { status })
}

/** 删除文章 */
export function deleteArticle(id) {
  return request.delete(`/admin/articles/${id}`)
}
