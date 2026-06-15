import request from '@/utils/request'

/** 公开:站点信息(全站左栏 + 关于页)→ SiteInfo */
export function getSiteInfo() {
  return request.get('/site/info')
}

/* ============ 管理接口(需登录) ============ */

/** 读取站点信息 / 作者资料(后台编辑用) */
export function getAdminSiteInfo() {
  return request.get('/admin/site-info')
}

/**
 * 更新站点信息
 * Body: { nickname, avatarUrl, bio, aboutContent, email, wechat,
 *         wechatQrUrl, githubUrl, rssUrl, location, job }
 */
export function updateSiteInfo(data) {
  return request.put('/admin/site-info', data)
}
