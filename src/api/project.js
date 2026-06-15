import request from '@/utils/request'

/** 公开:开源项目列表(按 sort)→ ProjectVO[] */
export function getProjects() {
  return request.get('/projects')
}

/* ============ 管理接口(需登录) ============ */

export function getAdminProjects() {
  return request.get('/admin/projects')
}

/** 新建 → { id }。Body: { name, description, techStack, githubUrl, sort } */
export function createProject(data) {
  return request.post('/admin/projects', data)
}

export function updateProject(id, data) {
  return request.put(`/admin/projects/${id}`, data)
}

export function deleteProject(id) {
  return request.delete(`/admin/projects/${id}`)
}
