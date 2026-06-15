import request from '@/utils/request'

/**
 * 公开:归档(倒序,前端按年 / 月分组)
 * @param {{ page?: number, pageSize?: number }} params
 * @returns PageResult<{ id, title, publishedAt }>
 */
export function getArchives(params) {
  return request.get('/archives', { params })
}
