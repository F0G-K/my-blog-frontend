import request from '@/utils/request'

/** 公开:标签列表(含每标签文章数,供标签云)→ TagVO[] */
export function getTags() {
  return request.get('/tags')
}

/* ============ 管理接口(需登录) ============ */

export function getAdminTags() {
  return request.get('/admin/tags')
}

export function createTag(data) {
  return request.post('/admin/tags', data)
}

export function deleteTag(id) {
  return request.delete(`/admin/tags/${id}`)
}
