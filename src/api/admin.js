import request from '@/utils/request'

/** 管理员登录 → { token }。Body: { username, password } */
export function login(data) {
  return request.post('/admin/login', data)
}

/**
 * 图片上传(MinIO),multipart/form-data,字段名 file → { url }
 * 供 md-editor-v3 上传钩子调用。
 * @param {File} file
 */
export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
