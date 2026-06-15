import request from '@/utils/request'

/**
 * 公开:全文检索(标题 + 正文 + 标签)
 * @param {{ keyword: string, page?: number, pageSize?: number }} params
 * @returns PageResult<SearchItem>  SearchItem = ArticleListItem + highlight
 */
export function search(params) {
  return request.get('/search', { params })
}
