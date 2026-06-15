import request from '@/utils/request'

/** 公开:分类列表(含每分类文章数)→ CategoryVO[] */
export function getCategories() {
  return request.get('/categories')
}

/* ============ 管理接口(需登录) ============ */

export function getAdminCategories() {
  return request.get('/admin/categories')
}

export function createCategory(data) {
  return request.post('/admin/categories', data)
}

export function updateCategory(id, data) {
  return request.put(`/admin/categories/${id}`, data)
}

export function deleteCategory(id) {
  return request.delete(`/admin/categories/${id}`)
}
